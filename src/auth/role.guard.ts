import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JwtPayload } from './auth.schema';
import { StaffRole, UserRole } from '@prisma/client';

export type UserRoleData = {
  userRole: UserRole;
  staffRole?: StaffRole;
};

export const AuthRoles = Reflector.createDecorator<UserRoleData>();

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roleData: UserRoleData = this.reflector.get(
      AuthRoles,
      context.getHandler(),
    );
    if (!roleData) return true;
    if (roleData.userRole === UserRole.STUDENT && !!roleData.staffRole) {
      // TODO: Remove error message
      console.error(
        'Error: Invalid role guard. Student cannot have a staff role.',
      );
      return false;
    }

    const request: Request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    return (
      user.userRole === roleData.userRole &&
      (!roleData.staffRole || user.staffRole === roleData.staffRole)
    );
  }
}
