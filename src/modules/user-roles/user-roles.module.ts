import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRole, UserRoleSchema } from '../../schemas/user-role.schema';
import { UserRolesController } from './user-roles.controller';
import { UserRolesService } from './user-roles.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: UserRole.name, schema: UserRoleSchema }])],
  controllers: [UserRolesController],
  providers: [UserRolesService],
})
export class UserRolesModule {}
