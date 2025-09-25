import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import { User } from 'src/auth/user.decorator';
import { Role, RoleGuard } from 'src/auth/role.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('student')
@Role('student')
@UseGuards(JwtAuthGuard, RoleGuard)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('enrollments')
  async listEnrollments(@User('id') studentId: string) {
    return await this.studentService.listEnrollments(studentId);
  }

  @Get('enrollments/:id')
  async listEnrollment(
    @User('id') studentId: string,
    @Param('id') enrollmentId: string,
  ) {
    return await this.studentService.listEnrollment(studentId, enrollmentId);
  }

  @Get('profile')
  async getProfile(@User('id') studentId: string) {
    return await this.studentService.getProfile(studentId);
  }
}
