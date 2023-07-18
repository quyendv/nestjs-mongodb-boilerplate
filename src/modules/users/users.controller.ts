import { Body, Controller, Get, Param, Patch, Post, UseInterceptors } from '@nestjs/common';
import MongooseClassSerializerInterceptor from 'src/interceptors/mongoose-class-serializer.intereptor';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

// @UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(MongooseClassSerializerInterceptor(User)) // Lưu ý không được quên User schema
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  // @SerializeOptions({
  //   excludePrefixes: ['first', 'last'],
  // }) // Nếu cần excludePrefixes cho các api cụ thể
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
