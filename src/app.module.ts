import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CollectionsModule } from '~modules/collections/collections.module';
import { FlashCardsModule } from '~modules/flash-cards/flash-cards.module';
import { TopicsModule } from '~modules/topics/topics.module';
import { UserRolesModule } from '~modules/user-roles/user-roles.module';
import { UsersModule } from '~modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    UsersModule,
    UserRolesModule,
    TopicsModule,
    FlashCardsModule,
    CollectionsModule,
    AuthModule,
  ],
})
export class AppModule {}
