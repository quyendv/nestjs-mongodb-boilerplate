import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PopulateOptions } from 'mongoose';
import { BaseRepository } from 'src/base/repositories/base.repository';
import { FindAllResponse } from 'src/types/common.type';
import { UserRole } from '~modules/user-roles/entities/user-role.entity';
import { User, UserDocument } from '~modules/users/entities/user.entity';

@Injectable() // Injectable để nestjs hiểu nó là 1 DI provider, có thể khởi tạo trực tiếp trong class khác bằng DI (giống như service được khởi tạo DI trong controller, và repository thì đc khởi tạo DI trong Service) -> cần đưa vào provider (k phải import) của module
export class UserRepository extends BaseRepository<User> {
  // Có thể tự thêm interface UserRepositoryInterface cho class này implements, để rõ ràng hơn theo hướng pattern (theo series), ở đây tạm bỏ đi tránh phức tạp hóa
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>, // tạo thêm property mới (bằng Dependency Injection qua cụm private readonly) là userModel (để tự build thêm method khi cần), song song với this.model được truyền vào super cũng là Model<User>
  ) {
    super(userModel); // tuy nhiên lớp cha dùng private readonly nên không this.model được
  }
  // TODO: Cần thêm fn gì riêng ngoài các fn class cha, dựa trên userModel vừa đc DI mới

  async findAllWithSubFields(
    condition: FilterQuery<UserDocument>,
    projection?: string,
    populate?: string[] | PopulateOptions | PopulateOptions[],
  ): Promise<FindAllResponse<UserDocument>> {
    const [count, items] = await Promise.all([
      this.userModel.count({ ...condition, deletedAt: null }),
      this.userModel.find({ ...condition, deletedAt: null }, projection).populate(populate), // nếu là string[] thì ...populate ra, VD: populate('key1 key2', 'sel1 sel2')
    ]);
    return {
      count,
      items,
    };
  }

  async getUserWithRole(userId: string): Promise<User> {
    return await this.userModel
      .findById(userId, '-password')
      .populate([{ path: 'role', transform: (role: UserRole) => role?.name }]); // NOTE: không biết có transform kiểu này -> có thể thay cho @Transform(...) trong entity với @UseInterceptors(MongooseClassSerializerInterceptor(User))
  }
}
