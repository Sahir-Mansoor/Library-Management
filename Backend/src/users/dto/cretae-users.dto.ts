import { IsEmail, IsNotEmpty, IsEnum, MinLength, IsOptional } from 'class-validator';
import { UserRole, UserStatus } from '../users.entity';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
