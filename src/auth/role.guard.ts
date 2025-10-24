import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JwtPayload } from './auth.schema';
import { UserRole } from '@prisma/client';

export const AuthRole = Reflector.createDecorator<UserRole>();

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const role: UserRole = this.reflector.get(AuthRole, context.getHandler());
    if (!role) return true;

    const request: Request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    return user.userRole === role;
  }
}
