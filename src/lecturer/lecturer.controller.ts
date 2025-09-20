import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LecturerService } from './lecturer.service';

@Controller('lecturer')
export class LecturerController {
  constructor(private readonly lecturerService: LecturerService) {}

  @Get('courses')
  async listCourses() {
    return await this.lecturerService.listCourses();
  }

  @Post('courses/:courseId/students/bulk')
  @UseInterceptors(FileInterceptor('file'))
  async registerStudentsBulk(
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.lecturerService.registerStudentsBulk(courseId, file);
  }

  @Post('courses/:courseId/students')
  async registerStudent(
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @Body() body: any,
  ) {
    return await this.lecturerService.registerStudent(courseId, body);
  }

  @Patch('courses/:courseId/students/:studentId')
  async updateStudent(
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Body() body: any,
  ) {
    return await this.lecturerService.updateStudent(courseId, studentId, body);
  }

  @Post('courses/:courseId/scores')
  @UseInterceptors(FileInterceptor('file'))
  async uploadScores(
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.lecturerService.uploadScores(courseId, file);
  }

  @Patch('courses/:courseId/scores/:studentId')
  async editScore(
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Body() body: any,
  ) {
    return await this.lecturerService.editScore(courseId, studentId, body);
  }

  @Get('courses/:courseId/results')
  async viewCourseResults(@Param('courseId', ParseUUIDPipe) courseId: string) {
    return await this.lecturerService.viewCourseResults(courseId);
  }

  @Get('courses/:courseId/students')
  async listCourseStudents(@Param('courseId', ParseUUIDPipe) courseId: string) {
    return await this.lecturerService.listCourseStudents(courseId);
  }
}
