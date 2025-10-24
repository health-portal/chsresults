import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { User } from 'src/auth/user.decorator';
import type { JwtPayload, StudentData } from 'src/auth/auth.schema';
import { ChangePasswordBody } from 'src/auth/auth.schema';
import { UserRole } from '@prisma/client';
import { AuthRole, UserRoleGuard } from 'src/auth/role.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('student')
@AuthRole(UserRole.STUDENT)
@UseGuards(JwtAuthGuard, UserRoleGuard)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post('change-password')
  async changePassword(
    @User() user: JwtPayload,
    @Body() body: ChangePasswordBody,
  ) {
    const studentData = user.userData as StudentData;
    return await this.studentService.changePassword(
      studentData.studentId,
      body,
    );
  }

  @Get('enrollments')
  async listEnrollments(
    @User() user: JwtPayload,
    @Query('sessionId', ParseUUIDPipe) sessionId: string,
  ) {
    const studentData = user.userData as StudentData;
    return await this.studentService.listEnrollments(
      studentData.studentId,
      sessionId,
    );
  }

  @Get('enrollments/:enrollmentId')
  async listEnrollment(
    @User() user: JwtPayload,
    @Query('sessionId', ParseUUIDPipe) sessionId: string,
    @Param('enrollmentId', ParseUUIDPipe) enrollmentId: string,
  ) {
    const studentData = user.userData as StudentData;
    return await this.studentService.listEnrollment(
      studentData.studentId,
      sessionId,
      enrollmentId,
    );
  }

  @Get('profile')
  async getProfile(@User() user: JwtPayload) {
    const studentData = user.userData as StudentData;
    return await this.studentService.getProfile(studentData.studentId);
  }
}
