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
import { Role, RolesGuard } from 'src/auth/roles.guard';
import { EditScoreBody, RegisterStudentBody } from './lecturer.schema';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Lecturer')
@ApiBearerAuth('accessToken')
@Controller('lecturer')
@Role('lecturer')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LecturerController {
  constructor(private readonly lecturerService: LecturerService) {}

  @Get('courses')
  @ApiOperation({ summary: 'List courses for a lecturer' })
  @ApiOkResponse({ description: 'List of courses' })
  async listCourses(@User('id') lecturerId: string) {
    return await this.lecturerService.listCourses(lecturerId);
  }

  @Post('courses/:courseId/students/batch')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Register students in batch for a course' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
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
  @ApiOperation({ summary: 'Register a single student for a course' })
  @ApiBody({ type: RegisterStudentBody })
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
  @ApiOperation({ summary: 'Upload scores for a course' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  async uploadScores(
    @User('id') lecturerId: string,
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.lecturerService.uploadScores(lecturerId, courseId, file);
  }

  @Patch('courses/:courseId/scores/:studentId')
  @ApiOperation({ summary: 'Edit a student’s result for a course' })
  @ApiBody({ type: EditScoreBody })
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
  @ApiOperation({ summary: 'View scores for a course' })
  @ApiOkResponse({ description: 'Course scores' })
  async viewCourseScores(
    @User('id') lecturerId: string,
    @Param('courseId', ParseUUIDPipe) courseId: string,
  ) {
    return await this.lecturerService.viewCourseScores(lecturerId, courseId);
  }

  @Get('courses/:courseId/students')
  @ApiOperation({ summary: 'List students enrolled in a course' })
  @ApiOkResponse({ description: 'List of students' })
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
