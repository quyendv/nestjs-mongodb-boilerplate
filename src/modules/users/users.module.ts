import { Module } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Collection } from 'mongoose';
import { UserRolesModule } from '~modules/user-roles/user-roles.module';
import { CollectionSchema } from '../collections/entities/collection.entity';
import { FlashCard, FlashCardSchema } from '../flash-cards/entities/flash-card.entity';
import { User, UserSchemaFactory } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: UserSchemaFactory,
        inject: [getModelToken(FlashCard.name), getModelToken(Collection.name)],
        imports: [
          MongooseModule.forFeature([
            { name: FlashCard.name, schema: FlashCardSchema },
            { name: Collection.name, schema: CollectionSchema },
          ]),
        ],
      },
    ]),
    UserRolesModule, // import for UserRolesService
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository], // cần cho các DI
})
export class UsersModule {}
