import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { NextFunction } from 'express';
import mongoose, { HydratedDocument, Model } from 'mongoose';
import { BaseEntity } from 'src/base/entities/base.entity';
import { schemaOptions } from 'src/configs/schema.config';
import { CollectionDocument } from '~modules/collections/entities/collection.entity';
import { FlashCardDocument } from '~modules/flash-cards/entities/flash-card.entity';
import { UserRole } from '~modules/user-roles/entities/user-role.entity';
import { Address, AddressSchema } from './address.entity';

export type UserDocument = HydratedDocument<User>;

export enum GENDER {
  Male = 'MALE',
  Female = 'FEMALE',
  Other = 'OTHER',
}

export enum LANGUAGES {
  ENGLISH = 'English',
  FRENCH = 'French',
  JAPANESE = 'Japanese',
  KOREAN = 'Korean',
  SPANISH = 'Spanish',
}
@Schema({ ...schemaOptions })
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
  // @Expose({ name: 'mail', toPlainOnly: true }) // NOTE: đổi tên sang mail, tuy nhiên phải thêm toPlainOnly nếu k sẽ mất thay vì đổi tên // toPlain là từ dataModel (Document) trả về json ở response
  email: string;

  @Prop({
    type: [String],
    enum: LANGUAGES,
  })
  interestedLanguages: LANGUAGES[];

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
    // select: false, // NOTE:  Nếu thêm vào thì bất kì api nào cũng không trả về 'password' (kể cả thông qua api khác hay gọi trực tiếp) -> không thể validate được gì
  })
  @Exclude() // hoặc thêm projection '-password' cho tùy trường hợp
  password: string;

  @Prop({
    default: 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png',
  })
  avatar?: string;

  @Prop()
  dateOfBirth?: Date;

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
  @Type(() => UserRole)
  @Transform(
    (value) => {
      // console.log(value); // NOTE {value, key, obj} -> Làm transform toObjectid mà k để ý obj
      return value.obj.role?.name; // trả về mỗi role: "USER"
    },
    { toClassOnly: true }, // chỉ được áp dụng khi chuyển đổi từ dữ liệu JSON (plain object) thành instance của class (toClassOnly) -> plainToClass trong MongooseClassSerializerInterceptor ở controller
  )
  role: UserRole;

  @Prop()
  headline?: string;

  @Prop()
  friendlyId?: number;

  @Prop({
    type: [{ type: AddressSchema }],
  })
  @Type(() => Address) // NOTE chỉ rõ Type để bên trong Address có exclude cũng hoạt động được
  address: Address[];

  @Prop({
    default: 'cus_mock_id',
  })
  @Exclude() // NOTE: loại bỏ khỏi quá trình serialization(transform to json/xml) | deserialization(json/xml to instance class) -> đi kèm ClassSerializerInterceptor trong controller (nhưng mongoose cần config thêm do k tương thích)
  stripeCustomerId: string;

  // Lưu ý nếu dùng với property: https://viblo.asia/p/setup-boilerplate-cho-du-an-nestjs-phan-3-request-validation-voi-class-validator-va-response-serialization-voi-class-transformer-AZoJjXROVY7#_exposing-properties-with-different-names-15, https://www.npmjs.com/package/class-transformer#exposing-properties-with-different-names
  @Expose({ name: 'fullName' })
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
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

  // Phải set virtuals: true trong toJson &| toObject // NOTE: dùng Expose classTransformer
  // user_schema.virtual('fullname').get(function (this: UserDocument) {
  //   return this.firstName + ' ' + this.lastName;
  // });

  user_schema.virtual('defaultAddress').get(function (this: UserDocument) {
    if (this.address.length) {
      return `${(this.address[0].street && ' ') || ''}${this.address[0].city} ${
        this.address[0].state
      } ${this.address[0].country}`;
    }
  });

  return user_schema;
};
