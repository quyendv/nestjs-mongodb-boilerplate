import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/services/base.service';
import { UserRole } from './entities/user-role.entity';
import { UserRoleRepository } from './repositories/user-role.repository';

@Injectable()
export class UserRolesService extends BaseService<UserRole, UserRoleRepository> {
  constructor(private readonly userRoleRepository: UserRoleRepository) {
    super(userRoleRepository);
  }
}
