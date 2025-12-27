import { Test, TestingModule } from '@nestjs/testing';
import { BookIssueService } from './book-issue.service';

describe('BookIssueService', () => {
  let service: BookIssueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookIssueService],
    }).compile();

    service = module.get<BookIssueService>(BookIssueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
