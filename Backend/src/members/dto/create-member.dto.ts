import { MemberStatus } from '../entities/member.entity';
import { IsNotEmpty, IsOptional, IsEnum, IsNumberString } from 'class-validator';

export class CreateMemberDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  membershipNumber: string;

  @IsNotEmpty()
  @IsNumberString()
  phone: string;

  @IsOptional()
  @IsEnum(MemberStatus)
  status?: MemberStatus;

  @IsOptional()
  borrowingLimit?: number;
}

