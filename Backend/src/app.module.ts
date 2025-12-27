import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { User } from './users/users.entity';
import { MembersModule } from './members/members.module';
import { Member } from './members/entities/member.entity';
import { Book } from './books/entities/books.entity';
import { BooksModule } from './books/books.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',      // your DB username
      password: 'sahir123',  // your DB password
      database: 'library',       // DB we just created
      entities: [User, Member, Book],
      synchronize: true,         // auto-create tables
    }),
    UsersModule,
    MembersModule,
    BooksModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
