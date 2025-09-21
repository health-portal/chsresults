import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LecturerService } from './lecturer.service';
import { User } from 'src/auth/user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role, RolesGuard } from 'src/auth/roles.guard';
import { EditResultBody, RegisterStudentBody } from './lecturer.schema';

@Controller('lecturer')
@Role('lecturer')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LecturerController {
  constructor(private readonly lecturerService: LecturerService) {}

  @Get('courses')
  async listCourses(@User('id') lecturerId: string) {
    return await this.lecturerService.listCourses(lecturerId);
  }

  @Post('courses/:courseId/students/bulk')
  @UseInterceptors(FileInterceptor('file'))
  async registerStudentsBulk(
    @User('id') lecturerId: string,
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.lecturerService.registerStudentsBulk(
      lecturerId,
      courseId,
      file,
    );
  }

  @Post('courses/:courseId/students')
  async registerStudent(
    @User('id') lecturerId: string,
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @Body() body: RegisterStudentBody,
  ) {
    return await this.lecturerService.registerStudent(
      lecturerId,
      courseId,
      body,
    );
  }

  @Post('courses/:courseId/results')
  @UseInterceptors(FileInterceptor('file'))
  async uploadResults(
    @User('id') lecturerId: string,
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.lecturerService.uploadResults(lecturerId, courseId, file);
  }

  @Patch('courses/:courseId/results/:studentId')
  async editResult(
    @User('id') lecturerId: string,
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Body() body: EditResultBody,
  ) {
    return await this.lecturerService.editResult(
      lecturerId,
      courseId,
      studentId,
      body,
    );
  }

  @Get('courses/:courseId/results')
  async viewCourseResults(
    @User('id') lecturerId: string,
    @Param('courseId', ParseUUIDPipe) courseId: string,
  ) {
    return await this.lecturerService.viewCourseResults(lecturerId, courseId);
  }

  @Get('courses/:courseId/students')
  async listCourseStudents(
    @User('id') lecturerId: string,
    @Param('courseId', ParseUUIDPipe) courseId: string,
  ) {
    return await this.lecturerService.listCourseStudents(lecturerId, courseId);
  }
}
