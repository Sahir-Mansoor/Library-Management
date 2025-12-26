import { MemberStatus } from '../entities/member.entity';
import { IsOptional, IsEnum, IsNumberString } from 'class-validator';

export class UpdateMemberDto {
  @IsOptional()
  @IsNumberString()
  phone?: string;

  @IsOptional()
  @IsEnum(MemberStatus)
  status?: MemberStatus;

  @IsOptional()
  borrowingLimit?: number;
  
}

