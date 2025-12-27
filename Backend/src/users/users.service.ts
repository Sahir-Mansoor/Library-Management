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
// ✅ Add generateNextUserId here
  async generateNextUserId(role: UserRole): Promise<string> {
    const prefix = role === UserRole.MEMBER ? 'MEM' : 'EMP';

    const lastUser = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.id LIKE :prefix', { prefix: `${prefix}-%` })
      .orderBy('user.id', 'DESC')
      .getOne();

    if (!lastUser) return `${prefix}-001`;

    const lastIdNumber = parseInt(lastUser.id.split('-')[1], 10);
    const nextIdNumber = lastIdNumber + 1;

    return `${prefix}-${String(nextIdNumber).padStart(3, '0')}`;
  }
  

  async createUser(dto: CreateUserDto): Promise<User> {
    // 0️⃣ Validate required fields
  if (!dto.password) {
    throw new Error('Password is required'); // Or use NestJS BadRequestException
  }
  if (!dto.email) {
    throw new Error('Email is required');
  }
  if (!dto.name) {
    throw new Error('Name is required');
  }
  if (!dto.role) {
    throw new Error('Role is required');
  }
  // 1️⃣ Generate next ID based on role
  const id = await this.generateNextUserId(dto.role);

  // 2️⃣ Hash password
  const hashedPassword = await bcrypt.hash(dto.password, 10);

  // 3️⃣ Create user entity with generated ID
  const user = this.usersRepository.create({
    id,                 // Use generated ID (MEM-XXX or EMP-XXX)
    ...dto,
    password: hashedPassword,
  });

  // 4️⃣ Save to DB
  return this.usersRepository.save(user);
}

async updateUser(id: string, updateDto: Partial<CreateUserDto>): Promise<User> {
  const user = await this.usersRepository.findOne({ where: { id } });
  if (!user) throw new Error('User not found');

  // Only update editable fields
  user.name = updateDto.name ?? user.name;
  user.email = updateDto.email ?? user.email;
  user.status = updateDto.status ?? user.status;

  return this.usersRepository.save(user);
}
async deleteUser(id: string): Promise<void> {
  const user = await this.usersRepository.findOne({ where: { id } });
  if (!user) {
    throw new Error('User not found'); // or use NestJS NotFoundException
  }
  await this.usersRepository.remove(user);
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
