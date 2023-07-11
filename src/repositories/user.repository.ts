import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepositoryAbstract } from 'src/base/repositories/base.abstract.repository';
import { User } from '~schemas/user.schema';

@Injectable()
export class UserRepository extends BaseRepositoryAbstract<User> {
  // Có thể tự thêm interface UserRepositoryInterface cho class này implements, để rõ ràng hơn theo hướng pattern (theo series), ở đây tạm bỏ đi tránh phức tạp hóa
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {
    super(userModel);
  }
}
