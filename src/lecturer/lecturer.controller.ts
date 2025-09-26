import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
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
import { Role, RoleGuard } from 'src/auth/role.guard';
import { EditScoreBody, RegisterStudentBody } from './lecturer.schema';
import { UserRole } from 'src/auth/auth.schema';

@Controller('lecturer')
@Role(UserRole.LECTURER)
@UseGuards(JwtAuthGuard, RoleGuard)
export class LecturerController {
  constructor(private readonly lecturerService: LecturerService) {}

  @Get('courses')
  async listCourses(@User('id') lecturerId: string) {
    return await this.lecturerService.listCourses(lecturerId);
  }

  @Post('courses/:courseId/students/batch')
  @UseInterceptors(FileInterceptor('file'))
  async registerStudentsBatch(
    @User('id') lecturerId: string,
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 5 * 1024 })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
  ) {
    return await this.lecturerService.registerStudentsBatch(
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

  @Get('courses/:courseId/scores')
  async viewCourseScores(
    @User('id') lecturerId: string,
    @Param('courseId', ParseUUIDPipe) courseId: string,
  ) {
    return await this.lecturerService.viewCourseScores(lecturerId, courseId);
  }

  @Get('courses/:courseId/students')
  async listCourseStudents(
    @User('id') lecturerId: string,
    @Param('courseId', ParseUUIDPipe) courseId: string,
  ) {
    return await this.lecturerService.listCourseStudents(lecturerId, courseId);
  }

  @Get('profile')
  async getProfile(@User('id') lecturerId: string) {
    return await this.lecturerService.getProfile(lecturerId);
  }
}
