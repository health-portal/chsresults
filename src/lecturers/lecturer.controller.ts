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
import { AuthRole, UserRoleGuard } from 'src/auth/role.guard';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LecturerData } from 'src/auth/auth.schema';
import type { JwtPayload } from 'src/auth/auth.schema';
import { EditScoreBody, RegisterStudentBody } from './lecturers.schema';

@Controller('lecturer')
@AuthRole(UserRole.LECTURER)
@UseGuards(JwtAuthGuard, UserRoleGuard)
export class LecturerController {
  constructor(private readonly lecturerService: LecturerService) {}

  private getLecturerId(user: JwtPayload) {
    const lecturerData = user.userData as LecturerData;
    return lecturerData.lecturerId;
  }

  @Get('courses')
  async listCourses(@User() user: JwtPayload) {
    const lecturerId = this.getLecturerId(user);
    return this.lecturerService.listCourses(lecturerId);
  }

  @Post('courses/:courseId/students/batch')
  @UseInterceptors(FileInterceptor('file'))
  async registerStudents(
    @User() user: JwtPayload,
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 5 * 1024 })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
  ) {
    const lecturerId = this.getLecturerId(user);
    return await this.lecturerService.registerStudents(
      lecturerId,
      courseId,
      file,
    );
  }

  @Post('courses/:courseId/students')
  async registerStudent(
    @User() user: JwtPayload,
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @Body() body: RegisterStudentBody,
  ) {
    const lecturerId = this.getLecturerId(user);
    return await this.lecturerService.registerStudent(
      lecturerId,
      courseId,
      body,
    );
  }

  @Post('courses/:courseId/scores')
  @UseInterceptors(FileInterceptor('file'))
  async uploadScores(
    @User() user: JwtPayload,
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const lecturerId = this.getLecturerId(user);
    return await this.lecturerService.uploadScores(lecturerId, courseId, file);
  }

  @Patch('courses/:courseId/scores/:studentId')
  async editScore(
    @User() user: JwtPayload,
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Body() body: EditScoreBody,
  ) {
    const lecturerId = this.getLecturerId(user);
    return await this.lecturerService.editScore(
      lecturerId,
      courseId,
      studentId,
      body,
    );
  }

  @Get('courses/:courseId/scores')
  async viewCourseScores(
    @User() user: JwtPayload,
    @Param('courseId', ParseUUIDPipe) courseId: string,
  ) {
    const lecturerId = this.getLecturerId(user);
    return await this.lecturerService.viewCourseScores(lecturerId, courseId);
  }

  @Get('courses/:courseId/students')
  async listCourseStudents(
    @User() user: JwtPayload,
    @Param('courseId', ParseUUIDPipe) courseId: string,
  ) {
    const lecturerId = this.getLecturerId(user);
    return await this.lecturerService.listCourseStudents(lecturerId, courseId);
  }

  @Get('profile')
  async getProfile(@User() user: JwtPayload) {
    const lecturerId = this.getLecturerId(user);
    return await this.lecturerService.getProfile(lecturerId);
  }
}
