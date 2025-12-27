import { Module } from '@nestjs/common';
import { BookIssueService } from './book-issue.service';
import { BookIssueController } from './book-issue.controller';
import { User } from 'src/users/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from 'src/books/entities/books.entity';
import { BookIssue } from './entities/book-issue.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BookIssue,
      Book,
      User,   // 👈 REQUIRED for BookRepository & UserRepository
    ]),
  ],
  providers: [BookIssueService],
  controllers: [BookIssueController]
})
export class BookIssueModule {}
