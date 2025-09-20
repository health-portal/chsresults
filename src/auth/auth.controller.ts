import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  type AuthUserBody,
  type AuthStudentBody,
  authUserSchema,
  authStudentSchema,
} from './auth.schema';
import { ZodValidationPipe } from 'src/lib/zod-validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/activate-account')
  @UsePipes(new ZodValidationPipe(authUserSchema))
  activateAdminAccount(@Body() body: AuthUserBody) {
    return this.authService.activateAdminAccount(body);
  }

  @Post('admin/signin')
  @UsePipes(new ZodValidationPipe(authUserSchema))
  signinAdmin(@Body() body: AuthUserBody) {
    return this.authService.signinAdmin(body);
  }

  @Post('lecturer/activate-account')
  @UsePipes(new ZodValidationPipe(authUserSchema))
  activateLecturerAccount(@Body() body: AuthUserBody) {
    return this.authService.activateLecturerAccount(body);
  }

  @Post('lecturer/signin')
  @UsePipes(new ZodValidationPipe(authUserSchema))
  signinLecturer(@Body() body: AuthUserBody) {
    return this.authService.signinLecturer(body);
  }

  @Post('student/activate-account')
  @UsePipes(new ZodValidationPipe(authStudentSchema))
  activateStudentAccount(@Body() body: AuthStudentBody) {
    return this.authService.activateStudentAccount(body);
  }

  @Post('student/signin')
  @UsePipes(new ZodValidationPipe(authStudentSchema))
  signinStudent(@Body() body: AuthStudentBody) {
    return this.authService.signinStudent(body);
  }
}
