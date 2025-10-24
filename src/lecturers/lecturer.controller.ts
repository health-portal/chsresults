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

@Controller('lecturer')
@AuthRole(UserRole.LECTURER)
@UseGuards(JwtAuthGuard, UserRoleGuard)
export class LecturerController {
  constructor(private readonly lecturerService: LecturerService) {}

  @Get('courses')
  async listCourses(@User('id') lecturerId: string) {}

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
  ) {}

  @Post('courses/:courseId/students')
  async registerStudent(
    @User('id') lecturerId: string,
    @Param('courseId', ParseUUIDPipe) courseId: string,
  ) {}

  @Post('courses/:courseId/scores')
  @UseInterceptors(FileInterceptor('file'))
  async uploadScores(
    @User('id') lecturerId: string,
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {}

  @Patch('courses/:courseId/scores/:studentId')
  async editScore(
    @User('id') lecturerId: string,
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @Param('studentId', ParseUUIDPipe) studentId: string,
  ) {}

  @Get('courses/:courseId/scores')
  async viewCourseScores(
    @User('id') lecturerId: string,
    @Param('courseId', ParseUUIDPipe) courseId: string,
  ) {}

  @Get('courses/:courseId/students')
  async listCourseStudents(
    @User('id') lecturerId: string,
    @Param('courseId', ParseUUIDPipe) courseId: string,
  ) {}

  @Get('profile')
  async getProfile(@User('id') lecturerId: string) {}
}
