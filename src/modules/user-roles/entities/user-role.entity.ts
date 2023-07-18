import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Expose } from 'class-transformer';
import { HydratedDocument } from 'mongoose';
import { BaseEntity } from 'src/base/entities/base.entity';
import { schemaOptions } from 'src/configs/schema.config';

export type UserRoleDocument = HydratedDocument<UserRole>;

export enum USER_ROLE {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Schema(schemaOptions)
@Exclude() // cần exclude nhiều thì đặt đầu class, expose những cái cần
export class UserRole extends BaseEntity {
  @Prop({
    unique: true,
    default: USER_ROLE.USER,
    enum: USER_ROLE,
    required: true,
  })
  @Expose()
  name: USER_ROLE;

  @Prop()
  description: string;
}

export const UserRoleSchema = SchemaFactory.createForClass(UserRole);
