import { Prop } from '@nestjs/mongoose';
import { Expose, Transform } from 'class-transformer';

export class BaseEntity {
  _id?: string; // Sau này sẽ dùng với class-transformer để serialize dữ liệu response

  @Expose() // _id bị excludePrefix trong MongooseSerializer nên dùng id để thay
  @Transform((value) => value.obj?._id?.toString(), { toClassOnly: true }) // value: {value, key, obj}
  id?: string;

  @Prop({ default: null })
  deletedAt?: Date; // Dùng cho soft delete
}
