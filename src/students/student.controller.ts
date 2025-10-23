import {
  Body,
  Controller,
  Get,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { User } from 'src/auth/user.decorator';
import { ChangePasswordBody } from 'src/auth/auth.schema';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post('change-password')
  async changePassword(
    @User('id') studentId: string,
    @Body() body: ChangePasswordBody,
  ) {
    return await this.studentService.changePassword(studentId, body);
  }

  @Get('enrollments')
  async listEnrollments(
    @User('id', ParseUUIDPipe) studentId: string,
    @Query('sessionId', ParseUUIDPipe) sessionId: string,
  ) {
    return await this.studentService.listEnrollments(studentId, sessionId);
  }

  @Get('profile')
  async getProfile(@User('id', ParseUUIDPipe) studentId: string) {
    return await this.studentService.getProfile(studentId);
  }
}
