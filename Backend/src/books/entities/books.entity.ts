import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Book {
  @ApiProperty()
  @PrimaryColumn()
  id: string;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  author: string;

  @ApiProperty()
  @Column({ unique: true })
  isbn: string;

  @ApiProperty()
  @Column()
  category: string;

  @ApiProperty()
  @Column()
  totalCopies: number;

  @ApiProperty()
  @Column()
  availableCopies: number;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;
}
