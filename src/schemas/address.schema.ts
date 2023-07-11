import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseEntity } from 'src/base/entities/base.entity';
import { schemaOptions } from 'src/configs/schema.config';

export type AddressDocument = HydratedDocument<Address>;

@Schema(schemaOptions)
export class Address extends BaseEntity {
  @Prop({ minlength: 2, maxlength: 120 })
  street?: string;

  @Prop({ required: true, minlength: 2, maxlength: 50 })
  state: string;

  @Prop({ required: true, minlength: 2, maxlength: 50 })
  city: string;

  @Prop({ minlength: 2, maxlength: 50 })
  postalCode?: number;

  @Prop({ required: true, minlength: 2, maxlength: 50 })
  country: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
