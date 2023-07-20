import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base/repositories/base.repository';
import { Topic } from '../entities/topic.entity';

@Injectable()
export class TopicRepository extends BaseRepository<Topic> {
  constructor(@InjectModel(Topic.name) private readonly topicModel: Model<Topic>) {
    super(topicModel);
  }
}
