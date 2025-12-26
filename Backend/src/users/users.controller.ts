import { UsersService } from './users.service';
import { CreateUserDto } from './dto/cretae-users.dto';
import { Controller, Get, Post, Body, Param, Put, Delete} from '@nestjs/common';


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
}
