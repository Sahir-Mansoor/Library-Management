import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from './entities/member.entity';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { User } from '../users/users.entity';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepo: Repository<Member>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Member[]> {
  return this.memberRepo.find({ relations: ['user'] }); // join user
}

async findOne(id: string): Promise<Member | null> {
  return this.memberRepo.findOne({ where: { id }, relations: ['user'] });
}



  async create(dto: CreateMemberDto): Promise<Member> {
    const member = this.memberRepo.create({ ...dto, id: `M${Date.now()}` });
    return this.memberRepo.save(member);
  }

  async update(id: string, dto: UpdateMemberDto): Promise<Member | null> {
    await this.memberRepo.update(id, dto);
    return this.memberRepo.findOne({ where: { id } });
  }

  async delete(id: string): Promise<void> {
    await this.memberRepo.delete(id);
  }


}
