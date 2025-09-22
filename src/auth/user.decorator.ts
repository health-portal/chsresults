import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from './auth.schema';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();

    return data ? request.user?.[data] : (request.user as JwtPayload);
  },
);
