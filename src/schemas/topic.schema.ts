import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from 'src/base/entities/base.entity';
import { schemaOptions } from 'src/configs/schema.config';

@Schema(schemaOptions)
export class Topic extends BaseEntity {
  @Prop({
    unique: true,
    required: true,
  })
  name: string;

  @Prop()
  description?: string;
}

export const TopicSchema = SchemaFactory.createForClass(Topic);
