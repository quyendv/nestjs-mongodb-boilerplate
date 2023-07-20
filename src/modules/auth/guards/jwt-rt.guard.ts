import { AuthGuard } from '@nestjs/passport';

export class JwtRefreshTokenGuard extends AuthGuard('refreshToken') {} // must equal name 'refreshToken' in strategy
