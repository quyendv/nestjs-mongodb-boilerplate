import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from 'src/types/auth.type';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'refreshToken') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'refresh_token_secret',
      passReqToCallback: true, // hàm bên dưới sẽ có thêm tham số Request ở vị trí ĐẦU TIÊN, mặc định sẽ chỉ là (payload, done?)
      // ignoreExpiration: false, // default
    });
  }

  async validate(request: Request, payload: TokenPayload) {
    // NOTE: Tất cả trường hợp bao gồm thiếu token, token sai/nhầm giữa acc_token với ref_token (invalid), hay hết hạn (expired) đều tự bắn ra 401, nếu đúng là ref_token thì mới bắt đầu vào hàm validate này -> khó hiểu

    const token = request.header('Authorization'); // request.headers.authorization
    // if (!token) throw new UnauthorizedException('Require authorization'); // tự bắn 401 trước rồi
    return await this.authService.getUserIfRefreshTokenMatched(
      payload.sub, // userId
      token.split(' ')[1], // split('Bearer ')[1],
    ); // return user here and req.user = user
  }
}
