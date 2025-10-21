import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  SetPasswordBody,
  RequestPasswordResetBody,
  SigninUserBody,
} from './auth.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('activate')
  @HttpCode(HttpStatus.OK)
  async activateUser(@Body() body: SetPasswordBody) {
    return await this.authService.activateUser(body);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signinUser(@Body() body: SigninUserBody) {
    return await this.authService.signinUser(body);
  }

  @Post('reset-password/request')
  @HttpCode(HttpStatus.OK)
  async requestPasswordReset(@Body() body: RequestPasswordResetBody) {
    return await this.authService.requestPasswordReset(body);
  }

  @Post('reset-password/confirm')
  @HttpCode(HttpStatus.OK)
  async confirmPasswordReset(@Body() body: SetPasswordBody) {
    return await this.authService.confirmPasswordReset(body);
  }
}
