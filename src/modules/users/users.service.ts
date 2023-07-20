import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/services/base.service';
import { FindAllResponse } from 'src/types/common.type';
import { USER_ROLE } from '~modules/user-roles/entities/user-role.entity';
import { UserRolesService } from '~modules/user-roles/user-roles.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';

@Injectable() // Injectable để nestjs hiểu nó là 1 DI provider, có thể khởi tạo trực tiếp trong class khác bằng DI -> nhớ thêm vào provider (k phải import) trong module
export class UsersService extends BaseService<User, UserRepository> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userRolesService: UserRolesService,
  ) {
    super(userRepository);
  }
  // TODO: Xây dựng các api/service dựa trên method trong Repository và ModuleService khác (nhớ import/export). Nếu repository không có 1 số method (tương tác với db) cần thì tạo thêm trong repository (trong đó đã tạo thêm model riêng rồi)

  async create(createUserDto: CreateUserDto) {
    // TODO: check email (username) existed // nhưng mà thường tạo ở auth, nên check ở auth trước cũng được
    let userRole = await this.userRolesService.findOneByConditions({ name: USER_ROLE.USER });
    if (!userRole) {
      userRole = await this.userRolesService.create({ name: USER_ROLE.USER });
    }
    const user = await this.userRepository.create({ ...createUserDto, role: userRole }); // NOTE: không cần gán "._id", truyền thẳng Object: Mongoose sẽ tự động chuyển đổi đối tượng UserRole thành ObjectId tương ứng khi lưu vào cơ sở dữ liệu.
    return user;
  }

  async findAll(filter?: object, projection?: string): Promise<FindAllResponse<User>> {
    return await this.userRepository.findAllWithSubFields(filter, projection, { path: 'role' }); // auto get role
  }

  async setRefreshToken(id: string, hashedToken: string): Promise<void> {
    await this.userRepository.update(id, { refreshToken: hashedToken });
  }

  async getUserWithRole(userId: string): Promise<User> {
    return await this.userRepository.getUserWithRole(userId);
  }
}
