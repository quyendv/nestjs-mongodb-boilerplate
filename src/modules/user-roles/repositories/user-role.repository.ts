import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base/repositories/base.repository';
import { UserRole } from '../entities/user-role.entity';

@Injectable()
export class UserRoleRepository extends BaseRepository<UserRole> {
  constructor(@InjectModel(UserRole.name) private readonly userRoleModel: Model<UserRole>) {
    super(userRoleModel);
  }
}
