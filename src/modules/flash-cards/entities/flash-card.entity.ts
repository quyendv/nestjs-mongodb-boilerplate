import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseEntity } from 'src/base/entities/base.entity';
import { schemaOptions } from 'src/configs/schema.config';
import { Topic } from '~modules/topics/entities/topic.entity';
import { User } from '~modules/users/entities/user.entity';

export type FlashCardDocument = HydratedDocument<FlashCard>;

@Schema(schemaOptions)
export class FlashCard extends BaseEntity {
  @Prop({ required: true })
  vocabulary: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  definition: string;

  @Prop({ required: true })
  meaning: string;

  @Prop()
  pronunciation?: string;

  @Prop({ default: [], type: [String] })
  examples?: string[];

  @Prop({ default: false })
  isPublic?: boolean;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: User;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Topic.name }] })
  topics?: Topic[];
}

export const FlashCardSchema = SchemaFactory.createForClass(FlashCard);
