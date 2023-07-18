import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/services/base.service';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';

@Injectable() // Injectable để nestjs hiểu nó là 1 DI provider, có thể khởi tạo trực tiếp trong class khác bằng DI -> nhớ thêm vào provider (k phải import) trong module
export class UsersService extends BaseService<User, UserRepository> {
  constructor(private readonly userRepository: UserRepository) {
    super(userRepository);
  }
  // TODO: Xây dựng các api/service dựa trên method trong Repository và ModuleService khác (nhớ import/export). Nếu repository không có 1 số method (tương tác với db) cần thì tạo thêm trong repository (trong đó đã tạo thêm model riêng rồi)
}
