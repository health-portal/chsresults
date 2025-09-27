import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from './auth.schema';
export declare const Role: import("@nestjs/core").ReflectableDecorator<UserRole, UserRole>;
export declare class RoleGuard implements CanActivate {
    private reflector;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean;
}
