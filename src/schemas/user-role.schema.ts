import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseEntity } from 'src/base/entities/base.entity';
import { schemaOptions } from 'src/configs/schema.config';

export type UserRoleDocument = HydratedDocument<UserRole>;

export enum USER_ROLE {
  ADMIN = 'Admin',
  USER = 'User',
}

@Schema(schemaOptions)
export class UserRole extends BaseEntity {
  @Prop({
    unique: true,
    default: USER_ROLE.USER,
    enum: USER_ROLE,
    required: true,
  })
  name: USER_ROLE;

  @Prop()
  description: string;
}

export const UserRoleSchema = SchemaFactory.createForClass(UserRole);
