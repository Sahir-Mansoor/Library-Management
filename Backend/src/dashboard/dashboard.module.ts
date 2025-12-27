import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Book } from 'src/books/entities/books.entity';
import { BookIssue } from 'src/book-issue/entities/book-issue.entity';
import { User } from 'src/users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book, BookIssue, User])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
