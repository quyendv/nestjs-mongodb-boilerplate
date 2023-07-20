import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '~modules/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAccessTokenStrategy } from './strategies/jwt-at.strategy';
import { JwtRefreshTokenStrategy } from './strategies/jwt-rt.stratety';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [UsersModule, PassportModule, JwtModule.register({})], // NOTE require passport + jwt
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtAccessTokenStrategy, JwtRefreshTokenStrategy], // NOTE require all strategies for DI - Injectable
})
export class AuthModule {}
