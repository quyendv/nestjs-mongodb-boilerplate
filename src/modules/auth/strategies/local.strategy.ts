import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable() // NOTE: cần injectable, Passport tự động DI sao ấy, k biết chỗ nào
export class LocalStrategy extends PassportStrategy(Strategy) {
  // param2 name is optional but use consistent vs @AuthGuard(name) // NOTE: default name here: 'local'
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' }); // mặc định là username
  }

  async validate(email: string, password: string) {
    // TODO: handle exception for require email, password (không dùng Dto được)
    const user = await this.authService.getAuthenticatedUser(email, password);
    if (!user) throw new UnauthorizedException(); // throw exception email not found + wrong password rồi nên chỗ này khó xảy ra
    return user; // here pass req.user = user (return value)
  }
}
