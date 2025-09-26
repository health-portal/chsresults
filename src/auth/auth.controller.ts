import { Controller, Post, Body, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiQuery,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Activate admin account' })
  @ApiBody({ type: AuthUserBody })
  @ApiCreatedResponse({ description: 'Admin account activated successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async activateAdminAccount(@Body() body: AuthUserBody) {
    return await this.authService.activate(UserRole.ADMIN, body);
  }

  @Post('admin/signin')
  @ApiOperation({ summary: 'Sign in admin' })
  @ApiBody({ type: AuthUserBody })
  @ApiCreatedResponse({
    description: 'Admin signed in successfully',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async signinAdmin(@Body() body: AuthUserBody) {
    return await this.authService.signin(UserRole.ADMIN, body);
  }

  @Post('admin/reset-password/request')
  @ApiOperation({ summary: 'Request admin password reset' })
  @ApiQuery({ name: 'email', type: String, required: true })
  @ApiCreatedResponse({ description: 'Password reset request sent' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async adminResetPasswordRequest(@Query('email') email: string) {
    return await this.authService.resetPasswordRequest(UserRole.ADMIN, email);
  }

  @Post('admin/reset-password')
  @ApiOperation({ summary: 'Reset admin password' })
  @ApiBody({ type: AuthUserBody })
  @ApiCreatedResponse({ description: 'Admin password reset successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async adminResetPassword(@Body() body: AuthUserBody) {
    return await this.authService.resetPassword(UserRole.ADMIN, body);
  }

  @Post('lecturer/activate-account')
  @ApiOperation({ summary: 'Activate lecturer account' })
  @ApiBody({ type: AuthUserBody })
  @ApiCreatedResponse({
    description: 'Lecturer account activated successfully',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async activateLecturerAccount(@Body() body: AuthUserBody) {
    return await this.authService.activate(UserRole.LECTURER, body);
  }

  @Post('lecturer/signin')
  @ApiOperation({ summary: 'Sign in lecturer' })
  @ApiBody({ type: AuthUserBody })
  @ApiCreatedResponse({ description: 'Lecturer signed in successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async signinLecturer(@Body() body: AuthUserBody) {
    return await this.authService.signin(UserRole.LECTURER, body);
  }

  @Post('lecturer/reset-password/request')
  @ApiOperation({ summary: 'Request lecturer password reset' })
  @ApiQuery({ name: 'email', type: String, required: true })
  @ApiCreatedResponse({ description: 'Password reset request sent' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async lecturerResetPasswordRequest(@Query('email') email: string) {
    return await this.authService.resetPasswordRequest(
      UserRole.LECTURER,
      email,
    );
  }

  @Post('lecturer/reset-password')
  @ApiOperation({ summary: 'Reset lecturer password' })
  @ApiBody({ type: AuthUserBody })
  @ApiCreatedResponse({ description: 'Lecturer password reset successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async lecturerResetPassword(@Body() body: AuthUserBody) {
    return await this.authService.resetPassword(UserRole.LECTURER, body);
  }

  @Post('student/activate-account')
  @ApiOperation({ summary: 'Activate student account' })
  @ApiBody({ type: AuthStudentBody })
  @ApiCreatedResponse({ description: 'Student account activated successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async activateStudentAccount(@Body() body: AuthStudentBody) {
    return this.authService.activateStudentAccount(body);
  }

  @Post('student/signin')
  @ApiOperation({ summary: 'Sign in student' })
  @ApiBody({ type: AuthStudentBody })
  @ApiCreatedResponse({ description: 'Student signed in successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async signinStudent(@Body() body: AuthStudentBody) {
    return this.authService.signinStudent(body);
  }

  @Post('student/reset-password/request')
  @ApiOperation({ summary: 'Request student password reset' })
  @ApiBody({ type: StudentIdentifierBody })
  @ApiCreatedResponse({ description: 'Password reset request sent' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async studentResetPasswordRequest(@Body() body: StudentIdentifierBody) {
    return await this.authService.studentResetPasswordRequest(body);
  }

  @Post('student/reset-password')
  @ApiOperation({ summary: 'Reset student password' })
  @ApiBody({ type: AuthStudentBody })
  @ApiCreatedResponse({ description: 'Student password reset successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async studentResetPassword(@Body() body: AuthStudentBody) {
    return await this.authService.studentResetPassword(body);
  }
}
