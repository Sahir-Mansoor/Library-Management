import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/books.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepo: Repository<Book>,
  ) {}

  findAll() {
    return this.bookRepo.find();
  }

  findOne(id: string) {
    return this.bookRepo.findOne({ where: { id } });
  }

  create(dto: CreateBookDto) {
    const book = this.bookRepo.create({
      ...dto,
      id: `BOOK-${Date.now()}`,
    });
    return this.bookRepo.save(book);
  }

  async update(id: string, dto: UpdateBookDto) {
    await this.bookRepo.update(id, dto);
    return this.findOne(id);
  }

  delete(id: string) {
    return this.bookRepo.delete(id);
  }
}
