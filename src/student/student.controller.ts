import { Controller, Get, Param, UseGuards } from '@nestjs/common';
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

@ApiTags('Student')
@ApiBearerAuth()
@Controller('student')
@Role(UserRole.STUDENT)
@UseGuards(JwtAuthGuard, RoleGuard)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('enrollments')
  @ApiOperation({ summary: 'List all enrollments for the student' })
  @ApiOkResponse({ description: 'Enrollments retrieved successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async listEnrollments(@User('id') studentId: string) {
    return await this.studentService.listEnrollments(studentId);
  }

  @Get('enrollments/:id')
  @ApiOperation({ summary: 'Get details of a specific enrollment' })
  @ApiParam({ name: 'id', type: String, description: 'Enrollment ID' })
  @ApiOkResponse({ description: 'Enrollment retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Enrollment not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async listEnrollment(
    @User('id') studentId: string,
    @Param('id') enrollmentId: string,
  ) {
    return await this.studentService.listEnrollment(studentId, enrollmentId);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get student profile' })
  @ApiOkResponse({ description: 'Profile retrieved successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async getProfile(@User('id') studentId: string) {
    return await this.studentService.getProfile(studentId);
  }
}
