import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { NextFunction } from 'express';
import mongoose, { HydratedDocument, Model } from 'mongoose';
import { BaseEntity } from 'src/base/entities/base.entity';
import { schemaOptions } from 'src/configs/schema.config';
import { CollectionDocument } from '~modules/collections/entities/collection.entity';
import { Address, AddressSchema } from './address.entity';
import { UserRole } from '~modules/user-roles/entities/user-role.entity';
import { FlashCardDocument } from '~modules/flash-cards/entities/flash-card.entity';

export type UserDocument = HydratedDocument<User>;

export enum GENDER {
  Male = 'MALE',
  Female = 'FEMALE',
  Other = 'OTHER',
}
@Schema({ ...schemaOptions, virtuals: true })
export class User extends BaseEntity {
  @Prop({
    required: true,
    minlength: 2,
    maxlength: 60,
    set: (first_name: string) => {
      return first_name.trim();
    },
  })
  firstName: string;

  @Prop({
    required: true,
    minlength: 2,
    maxlength: 60,
    set: (last_name: string) => {
      return last_name.trim();
    },
  })
  lastName: string;

  @Prop({
    required: true,
    unique: true,
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
  })
  email: string;

  @Prop({
    match: /^([+]\d{2})?\d{10}$/,
    get: (phone_number: string) => {
      if (!phone_number) {
        return;
      }
      const last_three_digits = phone_number.slice(phone_number.length - 3);
      return `****-***-${last_three_digits}`; // chỉ show 3 số cuối
    },
  })
  phoneNumber?: string;

  @Prop({
    required: true,
    unique: true,
  })
  username: string;

  @Prop({
    required: true,
    select: false,
  })
  password: string;

  @Prop({
    default: 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png',
  })
  avatar?: string;

  @Prop()
  date_of_birth?: Date;

  @Prop({
    enum: GENDER,
  })
  gender?: GENDER;

  @Prop({ default: 0 })
  point?: number;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: UserRole.name,
  })
  role: UserRole;

  @Prop()
  headline?: string;

  @Prop()
  friendlyId?: number;

  @Prop({
    type: AddressSchema,
  })
  address: Address;
}

export const UserSchema = SchemaFactory.createForClass(User);

export const UserSchemaFactory = (
  flashCardModel: Model<FlashCardDocument>,
  collectionModel: Model<CollectionDocument>,
) => {
  const user_schema = UserSchema;

  user_schema.pre('findOneAndDelete', async function (next: NextFunction) {
    // OTHER USEFUL METHOD: getOptions, getPopulatedPaths, getQuery = getFilter, getUpdate
    const user: UserDocument = await this.model.findOne(this.getFilter()); // lấy user trong db theo filter khi gọi findOneAndDelete
    await Promise.all([
      flashCardModel.deleteMany({
        user: user._id,
      }), // .exec()
      collectionModel.deleteMany({
        user: user._id,
      }), // .exec()
    ]);
    return next(); // nên dùng return để tránh thực thi đoạn code dưới next() nếu có, gây lỗi ngoài ý muốn
  });

  // Phải set virtuals: true trong toJson &| toObject
  user_schema.virtual('fullname').get(function (this: UserDocument) {
    return this.firstName + ' ' + this.lastName;
  });

  return user_schema;
};
