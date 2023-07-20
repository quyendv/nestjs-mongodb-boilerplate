import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable() // NOTE: hình như không cần @Injectable
export class LocalAuthGuard extends AuthGuard('local') {}
