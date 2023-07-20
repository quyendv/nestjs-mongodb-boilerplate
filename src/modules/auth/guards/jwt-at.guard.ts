import { AuthGuard } from '@nestjs/passport';

// @Injectable() // optional?
export class JwtAccessTokenGuard extends AuthGuard('jwt') {}
