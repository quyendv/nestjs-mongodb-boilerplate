import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseEntity } from 'src/base/entities/base.entity';
import { schemaOptions } from 'src/configs/schema.config';
import { User } from 'src/schemas/user.schema';

export enum COLLECTION_LEVEL {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  CHAOS = 'chaos',
}

export type CollectionDocument = HydratedDocument<Collection>;
@Schema(schemaOptions)
export class Collection extends BaseEntity {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ default: COLLECTION_LEVEL.EASY, enum: COLLECTION_LEVEL })
  level?: COLLECTION_LEVEL;

  @Prop()
  order?: number;

  @Prop()
  image?: string;

  @Prop({ default: 0, min: 0 })
  totalFlashCards?: number;

  @Prop({ default: false })
  isPublic?: boolean;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: User;
}

export const CollectionSchema = SchemaFactory.createForClass(Collection);
