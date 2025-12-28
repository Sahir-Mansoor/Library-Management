import { UsersService } from './users.service';
import { CreateUserDto } from './dto/cretae-users.dto';
import { Controller, Get, Post, Body, Param, Put, Delete, NotFoundException} from '@nestjs/common';
import { User } from './users.entity';

@Controller('users') // <--- this defines the route prefix
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    debugger;
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: Partial<CreateUserDto>) {
  return this.usersService.updateUser(id, updateUserDto);
}
 @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
    debugger;
    await this.usersService.deleteUser(id);
    return { message: 'User deleted successfully' };
  }
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    try {
      const user = await this.usersService.findById(id);
      return user;
    } catch (err) {
      // You can throw NestJS NotFoundException for proper HTTP 404
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
