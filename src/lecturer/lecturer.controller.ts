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
import { EditScoreBody, RegisterStudentBody } from './lecturer.schema';

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

  @Post('courses/:courseId/scores')
  @UseInterceptors(FileInterceptor('file'))
  async uploadScores(
    @User('id') lecturerId: string,
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.lecturerService.uploadScores(lecturerId, courseId, file);
  }

  @Patch('courses/:courseId/scores/:studentId')
  async editScore(
    @User('id') lecturerId: string,
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Body() body: EditScoreBody,
  ) {
    return await this.lecturerService.editScore(
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
