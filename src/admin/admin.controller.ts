import {
  Body,
  Controller,
  Post,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Role, RoleGuard } from 'src/auth/role.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateCourseBody } from './admin.schema';
import { CreateStudentBody, CreateLecturerBody } from 'src/repository/schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserRole } from 'src/auth/auth.schema';
import { User } from 'src/auth/user.decorator';

@Controller('admin')
@Role(UserRole.ADMIN)
@UseGuards(JwtAuthGuard, RoleGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('courses')
  async createCourse(@Body() body: CreateCourseBody) {
    return await this.adminService.createCourse(body);
  }

  @Post('lecturers')
  async createLecturer(@Body() body: CreateLecturerBody) {
    return await this.adminService.createLecturer(body);
  }

  @Post('lecturers/batch')
  @UseInterceptors(FileInterceptor('file'))
  async createLecturersBatch(
    @User('id') adminId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.adminService.createLecturersBatch(file, adminId);
  }

  @Post('students')
  async createStudent(@Body() body: CreateStudentBody) {
    return await this.adminService.createStudent(body);
  }

  @Post('students/batch')
  @UseInterceptors(FileInterceptor('file'))
  async createStudentsBatch(
    @User('id') adminId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.adminService.createStudentsBatch(file, adminId);
  }
}
