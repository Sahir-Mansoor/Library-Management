import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole, UserStatus } from './users.entity';
import { CreateUserDto } from './dto/cretae-users.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepository.create({
      ...dto,
      password: hashedPassword,
      status: dto.status || UserStatus.ACTIVE,
    });
    return this.usersRepository.save(user);
  }

async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
        throw new Error('User not found'); // or NestJS NotFoundException
    }
    return user;
}


async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
if (!user) {
        throw new Error('User not found'); // or NestJS NotFoundException
    }
    return user;
}


  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
}
