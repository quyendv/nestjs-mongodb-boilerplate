import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { SALT_ROUND } from 'src/constants/auth.constant';
import { TokenPayload } from 'src/types/auth.type';
import { User } from '~modules/users/entities/user.entity';
import { UsersService } from '~modules/users/users.service';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const existedUser = await this.userService.findOneByConditions({ email: signUpDto.email });
    if (existedUser) throw new ConflictException('Email already existed'); // 409

    const hashedPassword = await bcrypt.hash(signUpDto.password, SALT_ROUND);
    const user = await this.userService.create({
      ...signUpDto,
      username: `${signUpDto.email.split('@')[0]}${Math.floor(10 + Math.random() * 990)}`, // chèn thêm 2-3 chũ số nguyên [10, 999]
      password: hashedPassword,
    });
    return user;
  }

  /**
   * Cách 1: Làm thủ công như signUp: check email existed -> check valid password -> trả về tokens (Giống LearnNestJs hay các NodeJS projects đã từng làm)
   * Cách 2: Dùng LocalStrategy thì check email, password bằng '@AuthGuard('local')' hay LocalAuthGuard -> tuy nhiên cách 1 check SignInDto được còn cách này chắc chỉ check thủ công
   */
  async signIn(userId: string) {
    const accessToken = this.generateAccessToken({ sub: userId });
    const refreshToken = this.generateRefreshToken({ sub: userId });
    // TODO: save refresh token in db
    return { accessToken, refreshToken };
  }

  async getAuthenticatedUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findOneByConditions({ email });
    if (!user) throw new NotFoundException('Email does not exist. Please register for an account');
    await this.verifyPassword(password, user.password);
    return user;
  }

  private async verifyPassword(plainText: string, hashedText: string): Promise<void> {
    const isMatching = await bcrypt.compare(plainText, hashedText);
    if (!isMatching) throw new BadRequestException('Password is incorrect');
  }

  generateAccessToken(payload: TokenPayload) {
    // NOTE: or using await ...signAsync(payload: {sub, ...otherKeys}, { secret, expiresIn, ... }) or registry with options in app.module // NOTE: https://docs.nestjs.com/security/authentication#jwt-token
    return this.jwtService.sign(payload, {
      secret: 'access_token_secret',
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME, // 60, "2 days", "10h", "7d" -> default number is ms
    });
  }

  generateRefreshToken(payload: TokenPayload) {
    return this.jwtService.sign(payload, {
      secret: 'refresh_token_secret',
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME, // 60, "2 days", "10h", "7d" -> default number is ms
    });
  }
}
