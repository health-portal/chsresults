import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { fromNodeHeaders } from 'better-auth/node';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    try {
      const session = await this.authService.auth.api.getSession({
        headers: fromNodeHeaders(request.headers),
      });

      if (!session) {
        throw new UnauthorizedException('User is not authenticated');
      }

      return true;
    } catch (err) {
      throw new UnauthorizedException('User is not authenticated');
    }
  }
}
