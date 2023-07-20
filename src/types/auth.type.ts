import { Request } from 'express';
import { User } from '~modules/users/entities/user.entity';

export type TokenPayload = {
  sub: string; // "userId", consistent with JWT standards -> https://docs.nestjs.com/security/authentication#jwt-token
  // ...otherKeys
} & Record<string, any>; // object at least one key "sub": string

export interface RequestWithUser extends Request {
  user: User; // Mặc định Request nó có user sẵn rồi ý, nhưng mà kiểu user thì k rõ
}
