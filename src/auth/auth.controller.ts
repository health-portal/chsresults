import {
  Controller,
  Post,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiQuery,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  AuthUserBody,
  AuthStudentBody,
  UserRole,
  StudentIdentifierBody,
  SigninResponse,
  AdminProfileResponse,
  LecturerProfileResponse,
  StudentProfileResponse,
} from './auth.schema';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/activate-account')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Activate admin account' })
  @ApiBody({ type: AuthUserBody })
  @ApiOkResponse({
    description: 'Admin account activated successfully',
    type: AdminProfileResponse,
  })
  @ApiBadRequestResponse({ description: 'Admin already activated' })
  @ApiUnauthorizedResponse({ description: 'Admin not found' })
  async activateAdminAccount(@Body() body: AuthUserBody) {
    return await this.authService.activate(UserRole.ADMIN, body);
  }

  @Post('admin/signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in admin' })
  @ApiBody({ type: AuthUserBody })
  @ApiOkResponse({
    description: 'Admin signed in successfully',
    type: SigninResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Admin not found or invalid credentials',
  })
  @ApiForbiddenResponse({ description: 'Admin not activated' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async signinAdmin(@Body() body: AuthUserBody) {
    return await this.authService.signin(UserRole.ADMIN, body);
  }

  @Post('admin/reset-password/request')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request admin password reset' })
  @ApiQuery({ name: 'email', type: String, required: true })
  @ApiOkResponse({ description: 'Reset link sent to admin email' })
  @ApiNotFoundResponse({ description: 'Admin not found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async adminResetPasswordRequest(@Query('email') email: string) {
    return await this.authService.resetPasswordRequest(UserRole.ADMIN, email);
  }

  @Post('admin/reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset admin password' })
  @ApiBody({ type: AuthUserBody })
  @ApiOkResponse({
    description: 'Admin password reset successfully',
    type: AdminProfileResponse,
  })
  @ApiNotFoundResponse({ description: 'Admin not found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async adminResetPassword(@Body() body: AuthUserBody) {
    return await this.authService.resetPassword(UserRole.ADMIN, body);
  }

  @Post('lecturer/activate-account')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Activate lecturer account' })
  @ApiBody({ type: AuthUserBody })
  @ApiOkResponse({
    description: 'Lecturer account activated successfully',
    type: LecturerProfileResponse,
  })
  @ApiBadRequestResponse({ description: 'Lecturer already activated' })
  @ApiUnauthorizedResponse({ description: 'Lecturer not found' })
  async activateLecturerAccount(@Body() body: AuthUserBody) {
    return await this.authService.activate(UserRole.LECTURER, body);
  }

  @Post('lecturer/signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in lecturer' })
  @ApiBody({ type: AuthUserBody })
  @ApiOkResponse({
    description: 'Lecturer signed in successfully',
    type: SigninResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Lecturer not found or invalid credentials',
  })
  @ApiForbiddenResponse({ description: 'Lecturer not activated' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async signinLecturer(@Body() body: AuthUserBody) {
    return await this.authService.signin(UserRole.LECTURER, body);
  }

  @Post('lecturer/reset-password/request')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request lecturer password reset' })
  @ApiQuery({ name: 'email', type: String, required: true })
  @ApiOkResponse({ description: 'Reset link sent to lecturer email' })
  @ApiNotFoundResponse({ description: 'Lecturer not found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async lecturerResetPasswordRequest(@Query('email') email: string) {
    return await this.authService.resetPasswordRequest(
      UserRole.LECTURER,
      email,
    );
  }

  @Post('lecturer/reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset lecturer password' })
  @ApiBody({ type: AuthUserBody })
  @ApiOkResponse({
    description: 'Lecturer password reset successfully',
    type: LecturerProfileResponse,
  })
  @ApiNotFoundResponse({ description: 'Lecturer not found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async lecturerResetPassword(@Body() body: AuthUserBody) {
    return await this.authService.resetPassword(UserRole.LECTURER, body);
  }

  @Post('student/activate-account')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Activate student account' })
  @ApiBody({ type: AuthStudentBody })
  @ApiOkResponse({
    description: 'Student account activated successfully',
    type: StudentProfileResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Student already activated' })
  @ApiNotFoundResponse({ description: 'Student not found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async activateStudentAccount(@Body() body: AuthStudentBody) {
    return this.authService.activateStudentAccount(body);
  }

  @Post('student/signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in student' })
  @ApiBody({ type: AuthStudentBody })
  @ApiOkResponse({
    description: 'Student signed in successfully',
    type: SigninResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Student not found or invalid credentials',
  })
  @ApiForbiddenResponse({ description: 'Student not activated' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async signinStudent(@Body() body: AuthStudentBody) {
    return this.authService.signinStudent(body);
  }

  @Post('student/reset-password/request')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request student password reset' })
  @ApiBody({ type: StudentIdentifierBody })
  @ApiOkResponse({ description: 'Reset link sent to student email' })
  @ApiNotFoundResponse({ description: 'Student not found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async studentResetPasswordRequest(@Body() body: StudentIdentifierBody) {
    return await this.authService.studentResetPasswordRequest(body);
  }

  @Post('student/reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset student password' })
  @ApiBody({ type: AuthStudentBody })
  @ApiOkResponse({
    description: 'Student password reset successfully',
    type: StudentProfileResponse,
  })
  @ApiNotFoundResponse({ description: 'Student not found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async studentResetPassword(@Body() body: AuthStudentBody) {
    return await this.authService.studentResetPassword(body);
  }
}
