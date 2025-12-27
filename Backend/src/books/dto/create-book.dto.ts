import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  author: string;

  @IsNotEmpty()
  isbn: string;

  @IsNotEmpty()
  category: string;

  @IsNumber()
  totalCopies: number;

  @IsNumber()
  availableCopies: number;
}
