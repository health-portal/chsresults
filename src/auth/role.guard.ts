import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { Role } from './role.decorator';
import { AuthService } from './auth.service';
import { fromNodeHeaders } from 'better-auth/node';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const role = this.reflector.get(Role, context.getHandler());
    if (!role) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    this.authService.client.api
      .getSession({
        headers: fromNodeHeaders(request.headers),
      })
      .then((session) => {
        return session?.user.role == role;
      })
      .catch((err) => {
        throw new UnauthorizedException('User is unauthorized');
      });
    return true;
  }
}
