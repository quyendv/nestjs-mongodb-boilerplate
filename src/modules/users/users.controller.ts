import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/role.decorator';
import MongooseClassSerializerInterceptor from 'src/interceptors/mongoose-class-serializer.interceptor';
import { JwtAccessTokenGuard } from '~modules/auth/guards/jwt-at.guard';
import { RolesGuard } from '~modules/auth/guards/roles.guard';
import { USER_ROLE } from '~modules/user-roles/entities/user-role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

// @UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(MongooseClassSerializerInterceptor(User)) // Đặt trước controller để apply all api (hoặc đặt riêng từng api trước các route) -> chỉ kết quả trả về quả controller mới được serialize, nếu gọi service bên trong riêng (trong các module api khác) thì vẫn không serialize
@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(USER_ROLE.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  @ApiOperation({
    summary: 'Admin create new user',
    description: `
    * Only admin can use this API
    * Admin create user and give some specific information`,
  })
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

  @Delete(':id')
  @Roles(USER_ROLE.ADMIN) // NOTE: phải đặt trước JwtAccessTokenGuard vì Request Lifecycle các guard trong cùng scope thực thi từ dưới lên (cần JwtAccessTokenGuard lấy thông tin user trước) -> Không đúng role throw Forbidden 403
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
