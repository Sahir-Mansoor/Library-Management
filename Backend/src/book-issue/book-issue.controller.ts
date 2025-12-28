import { Controller } from '@nestjs/common';
import { BookIssueService } from './book-issue.service';
import { Post, Body, Param,Get} from '@nestjs/common';

@Controller('book-issue')
export class BookIssueController {
  constructor(private readonly service: BookIssueService) {}

  @Post('issue')
  issueBook(@Body() body: { userId: string; bookId: string }) {
    return this.service.issueBook(body.userId, body.bookId)
  }
  @Get('user/:userId')
getUserIssuedBooks(@Param('userId') userId: string) {
  return this.service.findByUser(userId);
}

  @Post('return/:id')
  returnBook(@Param('id') id: string) {
    return this.service.returnBook(id)
  } 
  @Get()
  getAllIssues() {
    return this.service.findAll();
  }
}

