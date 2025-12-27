import { Injectable } from '@nestjs/common';
import { Repository, MoreThan, LessThan, Between } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/books/entities/books.entity';
import { BookIssue, IssueStatus } from 'src/book-issue/entities/book-issue.entity';
import { User, UserRole } from 'src/users/users.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepo: Repository<Book>,

    @InjectRepository(BookIssue)
    private readonly issueRepo: Repository<BookIssue>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getSummary() {
    const totalBooks = await this.bookRepo.count();
    const issuedBooks = await this.issueRepo.count({ where: { status: IssueStatus.ISSUED } });

    const availableBooksRaw = await this.bookRepo
      .createQueryBuilder('book')
      .select('SUM(book.availableCopies)', 'sum')
      .getRawOne();
    const availableBooks = parseInt(availableBooksRaw.sum) || 0;

    const totalMembers = await this.userRepo.count({ where: { role: 'MEMBER' as UserRole } });

    const overdueBooks = await this.issueRepo.count({
      where: {
        status: IssueStatus.ISSUED,
        dueDate: LessThan(new Date()),
      },
    });

    return { totalBooks, issuedBooks, availableBooks, totalMembers, overdueBooks };
  }

  async getRecentBooks() {
    return this.bookRepo.find({
      order: { createdAt: 'DESC' },
      take: 5,
      select: ['title', 'author'],
    });
  }

  async getQuickStats() {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const booksDueToday = await this.issueRepo.count({
      where: {
        status: IssueStatus.ISSUED,
        dueDate: Between(startOfDay, endOfDay),
      },
    });

    const newMembersThisMonth = await this.userRepo.count({
      where: {
        role: 'MEMBER' as UserRole,
        createdAt: MoreThan(startOfMonth),
      },
    });

    const mostPopularCategoryRaw = await this.bookRepo
      .createQueryBuilder('book')
      .select('book.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .groupBy('book.category')
      .orderBy('count', 'DESC')
      .limit(1)
      .getRawOne();

    const mostPopularCategory = mostPopularCategoryRaw?.category || 'N/A';

    return { booksDueToday, newMembersThisMonth, mostPopularCategory };
  }
}
