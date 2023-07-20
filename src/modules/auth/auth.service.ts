import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
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

  async signUp(signUpDto: SignUpDto): Promise<{ accessToken: string; refreshToken: string }> {
    const existedUser = await this.userService.findOneByConditions({ email: signUpDto.email });
    if (existedUser) throw new ConflictException('Email already existed'); // 409

    const hashedPassword = await bcrypt.hash(signUpDto.password, SALT_ROUND);
    const user = await this.userService.create({
      ...signUpDto,
      username: `${signUpDto.email.split('@')[0]}${Math.floor(10 + Math.random() * 990)}`, // chèn thêm 2-3 chũ số nguyên [10, 999]
      password: hashedPassword,
    });

    const accessToken = this.generateAccessToken({ sub: user._id.toString() });
    const refreshToken = this.generateRefreshToken({ sub: user._id.toString() });
    await this.storeRefreshToken(user._id.toString(), refreshToken);
    return { accessToken, refreshToken };
  }

  /**
   * Cách 1: Làm thủ công như signUp: check email existed -> check valid password -> trả về tokens (Giống LearnNestJs hay các NodeJS projects đã từng làm)
   * Cách 2: Dùng LocalStrategy thì check email, password bằng '@AuthGuard('local')' hay LocalAuthGuard -> tuy nhiên cách 1 check SignInDto được còn cách này chắc chỉ check thủ công
   */
  async signIn(userId: string): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = this.generateAccessToken({ sub: userId });
    const refreshToken = this.generateRefreshToken({ sub: userId });
    await this.storeRefreshToken(userId, refreshToken);
    return { accessToken, refreshToken };
  }

  async getAuthenticatedUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findOneByConditions({ email });
    if (!user) throw new NotFoundException('Email does not exist. Please register for an account');
    await this.verifyPlainWithHashed(password, user.password, 'Password is incorrect');
    return user;
  }

  private async verifyPlainWithHashed(
    plainText: string,
    hashedText: string,
    errorMsg?: string,
  ): Promise<void> {
    const isMatching = await bcrypt.compare(plainText, hashedText);
    if (!isMatching) throw new BadRequestException(errorMsg);
  }

  generateAccessToken(payload: TokenPayload): string {
    // NOTE: or using await ...signAsync(payload: {sub, ...otherKeys}, { algorithm, secret, expiresIn, ... }) or registry with options in app.module // NOTE: https://docs.nestjs.com/security/authentication#jwt-token
    return this.jwtService.sign(payload, {
      // algorithm: 'RS256', // cần bất đối xứng phần sau
      secret: 'access_token_secret',
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME, // 60, "2 days", "10h", "7d" -> default number is ms
    });
  }

  generateRefreshToken(payload: TokenPayload): string {
    return this.jwtService.sign(payload, {
      // algorithm: 'RS256', // cần bất đối xứng phần sau
      secret: 'refresh_token_secret',
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME, // 60, "2 days", "10h", "7d" -> default number is ms
    });
  }

  async storeRefreshToken(userId: string, token: string): Promise<void> {
    const hashToken = await bcrypt.hash(token, SALT_ROUND);
    await this.userService.setRefreshToken(userId, hashToken);
  }

  async getUserIfRefreshTokenMatched(userId: string, refreshToken: string): Promise<User> {
    const user = await this.userService.findOneById(userId);
    if (!user) throw new UnauthorizedException('Unauthorized with this token');
    await this.verifyPlainWithHashed(refreshToken, user.refreshToken, 'Refresh token is invalid'); // FIXME: vấn đề limit kí tự hash của bcryptjs dẫn đến token cũ cũng vẫn đúng: https://stackoverflow.com/questions/64470962/why-refresh-endpoint-return-new-tokens-when-i-use-old-refresh-token
    return user;
  }
}
