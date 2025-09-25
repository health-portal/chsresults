import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JwtPayload, UserRole } from './auth.schema';

export const Role = Reflector.createDecorator<UserRole>();

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const role = this.reflector.get(Role, context.getHandler());
    if (!role) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    return user.role === role;
  }
}
