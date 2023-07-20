import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from 'src/types/auth.type';
import { UsersService } from '~modules/users/users.service';

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy) /* default name: 'jwt' */ {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'access_token_secret',
      // ignoreExpiration: false, // default
    });
  }

  async validate(payload: TokenPayload) {
    return await this.usersService.findOneById(payload.sub); // sub refer passed userId in signIn/signUp passed
  }
}
