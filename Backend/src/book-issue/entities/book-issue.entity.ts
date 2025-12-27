import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm'
import { User } from '../../users/users.entity'
import { Book } from '../../books/entities/books.entity'

export enum IssueStatus {
  ISSUED = 'ISSUED',
  RETURNED = 'RETURNED',
}

@Entity()
export class BookIssue {
  @PrimaryGeneratedColumn('uuid')
  id: string

  // Who issued the book
  @ManyToOne(() => User, { eager: true })
  user: User

  // Which book
  @ManyToOne(() => Book, { eager: true })
  book: Book

  @Column()
  issueDate: Date

  @Column()
  dueDate: Date

  @Column({ nullable: true })
  returnDate: Date

  @Column({
    type: 'enum',
    enum: IssueStatus,
    default: IssueStatus.ISSUED,
  })
  status: IssueStatus

  @CreateDateColumn()
  createdAt: Date
}
