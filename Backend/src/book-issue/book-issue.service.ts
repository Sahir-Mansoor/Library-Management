import { Injectable, } from '@nestjs/common';
import { BookIssue, IssueStatus } from './entities/book-issue.entity';
import { Book } from 'src/books/entities/books.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';

@Injectable()
export class BookIssueService {

  constructor(
    @InjectRepository(BookIssue)
    private issueRepo: Repository<BookIssue>,

    @InjectRepository(Book)
    private bookRepo: Repository<Book>,
 @InjectRepository(BookIssue)
    private bookIssueRepository: Repository<BookIssue>,
        
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}
  

  async issueBook(userId: string, bookId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } })
    const book = await this.bookRepo.findOne({ where: { id: bookId } })

    if (!user) throw new Error('User not found')
    if (!book) throw new Error('Book not found')
    if (book.availableCopies <= 0)
      throw new Error('No copies available')

    const issue = this.issueRepo.create({
      user,
      book,
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
    })

    book.availableCopies -= 1
    await this.bookRepo.save(book)

    return this.issueRepo.save(issue)
  }
async findAll() {
    // fetch issued books with user and book relations
    return this.bookIssueRepository.find({
      relations: ['user', 'book'],
      order: { issueDate: 'DESC' }, // optional: newest first
    });
  }
  async returnBook(issueId: string) {
    const issue = await this.issueRepo.findOne({ where: { id: issueId } })
    if (!issue) throw new Error('Issue record not found')

    issue.returnDate = new Date()
    issue.status = IssueStatus.RETURNED

    issue.book.availableCopies += 1
    await this.bookRepo.save(issue.book)

    return this.issueRepo.save(issue)
  }
}

