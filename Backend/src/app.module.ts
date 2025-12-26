import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { User } from './users/users.entity';
import { MembersModule } from './members/members.module';
import { Member } from './members/entities/member.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',      // your DB username
      password: 'sahir123',  // your DB password
      database: 'library',       // DB we just created
      entities: [User, Member],
      synchronize: true,         // auto-create tables
    }),
    UsersModule,
    MembersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
