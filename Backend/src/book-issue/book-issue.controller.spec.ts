import { Test, TestingModule } from '@nestjs/testing';
import { BookIssueController } from './book-issue.controller';

describe('BookIssueController', () => {
  let controller: BookIssueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookIssueController],
    }).compile();

    controller = module.get<BookIssueController>(BookIssueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
