import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import { User } from 'src/auth/user.decorator';
import { Role, RoleGuard } from 'src/auth/role.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserRole } from 'src/auth/auth.schema';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { EnrollmentResponse } from 'src/courses/courses.schema';
import { ChangePasswordBody, StudentProfileResponse } from './student.schema';

@ApiTags('Student')
@ApiBearerAuth('accessToken')
@Controller('student')
@Role(UserRole.STUDENT)
@UseGuards(JwtAuthGuard, RoleGuard)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post('change-password')
  @ApiOperation({ summary: 'Change student password' })
  @ApiOkResponse({ description: 'Password updated successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async changePassword(
    @User('id') studentId: string,
    @Body() body: ChangePasswordBody,
  ) {
    return await this.studentService.changePassword(studentId, body);
  }

  @Get('enrollments')
  @ApiOperation({ summary: 'List all enrollments for the student' })
  @ApiOkResponse({
    description: 'Enrollments retrieved successfully',
    type: [EnrollmentResponse],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async listEnrollments(@User('id') studentId: string) {
    return await this.studentService.listEnrollments(studentId);
  }

  @Get('enrollments/:enrollmentId')
  @ApiOperation({ summary: 'Get details of a specific enrollment' })
  @ApiParam({
    name: 'enrollmentId',
    type: String,
    description: 'Enrollment ID',
  })
  @ApiOkResponse({ description: 'Enrollment retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Enrollment not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async listEnrollment(
    @User('id') studentId: string,
    @Param('enrollmentId') enrollmentId: string,
  ) {
    return await this.studentService.listEnrollment(studentId, enrollmentId);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get student profile' })
  @ApiOkResponse({
    description: 'Profile retrieved successfully',
    type: StudentProfileResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async getProfile(@User('id') studentId: string) {
    return await this.studentService.getProfile(studentId);
  }
}
