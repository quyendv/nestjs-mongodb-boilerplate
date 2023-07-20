import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import MongooseClassSerializerInterceptor from 'src/interceptors/mongoose-class-serializer.intereptor';
import { JwtAccessTokenGuard } from '~modules/auth/guards/jwt-at.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

// @UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(MongooseClassSerializerInterceptor(User)) // Đặt trước controller để apply all api (hoặc đặt riêng từng api trước các route) -> chỉ kết quả trả về quả controller mới được serialize, nếu gọi service bên trong riêng (trong các module api khác) thì vẫn không serialize
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
  @UseGuards(JwtAccessTokenGuard) // NOTE dùng dưới @Get cũng k quan trọng // có thể áp dụng toàn controller
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
