import { Controller, Post, Body, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  AuthUserBody,
  AuthStudentBody,
  UserRole,
  StudentIdentifierBody,
} from './auth.schema';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/activate-account')
  async activateAdminAccount(@Body() body: AuthUserBody) {
    return await this.authService.activate(UserRole.ADMIN, body);
  }

  @Post('admin/signin')
  async signinAdmin(@Body() body: AuthUserBody) {
    return await this.authService.signin(UserRole.ADMIN, body);
  }

  @Post('admin/reset-password/request')
  async adminResetPasswordRequest(@Query('email') email: string) {
    return await this.authService.resetPasswordRequest(UserRole.ADMIN, email);
  }

  @Post('admin/reset-password')
  async adminResetPassword(@Body() body: AuthUserBody) {
    return await this.authService.resetPassword(UserRole.ADMIN, body);
  }

  @Post('lecturer/activate-account')
  async activateLecturerAccount(@Body() body: AuthUserBody) {
    return await this.authService.activate(UserRole.LECTURER, body);
  }

  @Post('lecturer/signin')
  async signinLecturer(@Body() body: AuthUserBody) {
    return await this.authService.signin(UserRole.LECTURER, body);
  }

  @Post('lecturer/reset-password/request')
  async lecturerResetPasswordRequest(@Query('email') email: string) {
    return await this.authService.resetPasswordRequest(
      UserRole.LECTURER,
      email,
    );
  }

  @Post('lecturer/reset-password')
  async lecturerResetPassword(@Body() body: AuthUserBody) {
    return await this.authService.resetPassword(UserRole.LECTURER, body);
  }

  @Post('student/activate-account')
  async activateStudentAccount(@Body() body: AuthStudentBody) {
    return this.authService.activateStudentAccount(body);
  }

  @Post('student/signin')
  async signinStudent(@Body() body: AuthStudentBody) {
    return this.authService.signinStudent(body);
  }

  @Post('student/reset-password/request')
  async studentResetPasswordRequest(@Body() body: StudentIdentifierBody) {
    return await this.authService.studentResetPasswordRequest(body);
  }

  @Post('student/reset-password')
  async studentResetPassword(@Body() body: AuthStudentBody) {
    return await this.authService.studentResetPassword(body);
  }
}
