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
  SigninUserBody,
  SigninStudentBody,
  StudentIdentifierBody,
  SigninResponse,
  VerifyUserBody,
  VerifyStudentBody,
} from './auth.schema';
import { AdminProfileResponse } from 'src/admin/admin.schema';
import { LecturerProfileResponse } from 'src/lecturer/lecturer.schema';
import { StudentProfileResponse } from 'src/student/student.schema';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/activate-account')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify admin account' })
  @ApiBody({ type: VerifyUserBody })
  @ApiOkResponse({
    description: 'Admin account activated successfully',
    type: AdminProfileResponse,
  })
  @ApiBadRequestResponse({ description: 'Admin already activated' })
  @ApiUnauthorizedResponse({ description: 'Admin not found' })
  async activateAdmin(@Body() body: VerifyUserBody) {
    return await this.authService.activateAdmin(body);
  }

  @Post('admin/signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in admin' })
  @ApiBody({ type: SigninUserBody })
  @ApiOkResponse({
    description: 'Admin signed in successfully',
    type: SigninResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Admin not found or invalid credentials',
  })
  @ApiForbiddenResponse({ description: 'Admin not activated' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async signinAdmin(@Body() body: SigninUserBody) {
    return await this.authService.signinAdmin(body);
  }

  @Post('admin/reset-password/request')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request admin password reset' })
  @ApiQuery({ name: 'email', type: String, required: true })
  @ApiOkResponse({ description: 'Reset link sent to admin email' })
  @ApiNotFoundResponse({ description: 'Admin not found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async adminResetPasswordRequest(@Query('email') email: string) {
    return await this.authService.adminResetPasswordRequest(email);
  }

  @Post('admin/reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset admin password' })
  @ApiBody({ type: VerifyUserBody })
  @ApiOkResponse({
    description: 'Admin password reset successfully',
    type: AdminProfileResponse,
  })
  @ApiNotFoundResponse({ description: 'Admin not found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async adminResetPassword(@Body() body: VerifyUserBody) {
    return await this.authService.adminResetPassword(body);
  }

  @Post('lecturer/activate-account')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify lecturer account' })
  @ApiBody({ type: VerifyUserBody })
  @ApiOkResponse({
    description: 'Lecturer account activated successfully',
    type: LecturerProfileResponse,
  })
  @ApiBadRequestResponse({ description: 'Lecturer already activated' })
  @ApiUnauthorizedResponse({ description: 'Lecturer not found' })
  async activateLecturer(@Body() body: VerifyUserBody) {
    return await this.authService.activateLecturer(body);
  }

  @Post('lecturer/signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in lecturer' })
  @ApiBody({ type: SigninUserBody })
  @ApiOkResponse({
    description: 'Lecturer signed in successfully',
    type: SigninResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Lecturer not found or invalid credentials',
  })
  @ApiForbiddenResponse({ description: 'Lecturer not activated' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async signinLecturer(@Body() body: SigninUserBody) {
    return await this.authService.signinLecturer(body);
  }

  @Post('lecturer/reset-password/request')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request lecturer password reset' })
  @ApiQuery({ name: 'email', type: String, required: true })
  @ApiOkResponse({ description: 'Reset link sent to lecturer email' })
  @ApiNotFoundResponse({ description: 'Lecturer not found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async lecturerResetPasswordRequest(@Query('email') email: string) {
    return await this.authService.lecturerResetPasswordRequest(email);
  }

  @Post('lecturer/reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset lecturer password' })
  @ApiBody({ type: VerifyUserBody })
  @ApiOkResponse({
    description: 'Lecturer password reset successfully',
    type: LecturerProfileResponse,
  })
  @ApiNotFoundResponse({ description: 'Lecturer not found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async lecturerResetPassword(@Body() body: VerifyUserBody) {
    return await this.authService.lecturerResetPassword(body);
  }

  @Post('student/activate-account')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify student account' })
  @ApiBody({ type: VerifyStudentBody })
  @ApiOkResponse({
    description: 'Student account activated successfully',
    type: StudentProfileResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Student already activated' })
  @ApiNotFoundResponse({ description: 'Student not found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async activateStudent(@Body() body: VerifyStudentBody) {
    return this.authService.activateStudent(body);
  }

  @Post('student/signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in student' })
  @ApiBody({ type: SigninStudentBody })
  @ApiOkResponse({
    description: 'Student signed in successfully',
    type: SigninResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Student not found or invalid credentials',
  })
  @ApiForbiddenResponse({ description: 'Student not activated' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async signinStudent(@Body() body: SigninStudentBody) {
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
  @ApiBody({ type: VerifyStudentBody })
  @ApiOkResponse({
    description: 'Student password reset successfully',
    type: StudentProfileResponse,
  })
  @ApiNotFoundResponse({ description: 'Student not found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async studentResetPassword(@Body() body: VerifyStudentBody) {
    return await this.authService.studentResetPassword(body);
  }
}
