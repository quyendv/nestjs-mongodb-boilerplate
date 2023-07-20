import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES } from 'src/decorators/role.decorator';
import { RequestWithUser } from 'src/types/auth.type';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles: string[] = this.reflector.getAllAndOverride(ROLES, [
      context.getHandler(),
      context.getClass(),
    ]);
    const request: RequestWithUser = context.switchToHttp().getRequest(); // lấy request từ context
    console.log(request.user);
    return roles.includes(request.user.role as unknown as string); // request.user: User convert sang tring 'USER' thôi từ validate của JwtAccessTokenStrategy -> có thể tạo interface mới cho rõ ràng
  }
}
