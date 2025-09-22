import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthUserBody, AuthStudentBody } from './auth.schema';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/activate-account')
  @ApiOperation({ summary: 'Activate an admin account' })
  @ApiBody({ type: AuthUserBody })
  @ApiResponse({ status: 201, description: 'Admin account activated' })
  activateAdminAccount(@Body() body: AuthUserBody) {
    return this.authService.activateAdminAccount(body);
  }

  @Post('admin/signin')
  @ApiOperation({ summary: 'Admin sign in' })
  @ApiBody({ type: AuthUserBody })
  @ApiResponse({ status: 200, description: 'Admin signed in' })
  signinAdmin(@Body() body: AuthUserBody) {
    return this.authService.signinAdmin(body);
  }

  @Post('lecturer/activate-account')
  @ApiOperation({ summary: 'Activate a lecturer account' })
  @ApiBody({ type: AuthUserBody })
  @ApiResponse({ status: 201, description: 'Lecturer account activated' })
  activateLecturerAccount(@Body() body: AuthUserBody) {
    return this.authService.activateLecturerAccount(body);
  }

  @Post('lecturer/signin')
  @ApiOperation({ summary: 'Lecturer sign in' })
  @ApiBody({ type: AuthUserBody })
  @ApiResponse({ status: 200, description: 'Lecturer signed in' })
  signinLecturer(@Body() body: AuthUserBody) {
    return this.authService.signinLecturer(body);
  }

  @Post('student/activate-account')
  @ApiOperation({ summary: 'Activate a student account' })
  @ApiBody({ type: AuthStudentBody })
  @ApiResponse({ status: 201, description: 'Student account activated' })
  activateStudentAccount(@Body() body: AuthStudentBody) {
    return this.authService.activateStudentAccount(body);
  }

  @Post('student/signin')
  @ApiOperation({ summary: 'Student sign in' })
  @ApiBody({ type: AuthStudentBody })
  @ApiResponse({ status: 200, description: 'Student signed in' })
  signinStudent(@Body() body: AuthStudentBody) {
    return this.authService.signinStudent(body);
  }
}
