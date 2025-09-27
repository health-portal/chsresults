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
import {
  BatchStudentRegistrationResponse,
  EditScoreBody,
  RegisterStudentBody,
  UploadScoresResponse,
} from './lecturer.schema';
import { LecturerProfileResponse, UserRole } from 'src/auth/auth.schema';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnprocessableEntityResponse,
  ApiConsumes,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { CourseResponse, EnrollmentResponse } from 'src/courses/courses.schema';

@ApiTags('Lecturer')
@ApiBearerAuth('accessToken')
@Controller('lecturer')
@Role(UserRole.LECTURER)
@UseGuards(JwtAuthGuard, RoleGuard)
export class LecturerController {
  constructor(private readonly lecturerService: LecturerService) {}

  @Get('courses')
  @ApiOperation({ summary: 'List courses assigned to the lecturer' })
  @ApiOkResponse({
    description: 'Courses retrieved successfully',
    type: () => [CourseResponse],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async listCourses(@User('id') lecturerId: string) {
    return await this.lecturerService.listCourses(lecturerId);
  }

  @Post('courses/:courseId/students/batch')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Register multiple students to a course via file upload',
  })
  @ApiParam({ name: 'courseId', type: String, description: 'Course UUID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Students registered successfully',
    type: () => BatchStudentRegistrationResponse,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Course not found' })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid file or file size exceeds 5KB',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
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
  @ApiOperation({ summary: 'Register a single student to a course' })
  @ApiParam({ name: 'courseId', type: String, description: 'Course UUID' })
  @ApiBody({ type: () => RegisterStudentBody })
  @ApiCreatedResponse({
    description: 'Student registered successfully',
    type: () => EnrollmentResponse,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Course not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
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
  @ApiParam({ name: 'courseId', type: String, description: 'Course UUID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Scores uploaded successfully',
    type: () => UploadScoresResponse,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Course not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async uploadScores(
    @User('id') lecturerId: string,
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.lecturerService.uploadScores(lecturerId, courseId, file);
  }

  @Patch('courses/:courseId/scores/:studentId')
  @ApiOperation({ summary: 'Edit a student’s score for a course' })
  @ApiParam({ name: 'courseId', type: String, description: 'Course UUID' })
  @ApiParam({ name: 'studentId', type: String, description: 'Student UUID' })
  @ApiBody({ type: () => EditScoreBody })
  @ApiOkResponse({
    description: 'Score updated successfully',
    type: () => EnrollmentResponse,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Course or student not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
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
  @ApiParam({ name: 'courseId', type: String, description: 'Course UUID' })
  @ApiOkResponse({
    description: 'Course scores retrieved successfully',
    type: () => [EnrollmentResponse],
  })
  @ApiNotFoundResponse({ description: 'Course not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async viewCourseScores(
    @User('id') lecturerId: string,
    @Param('courseId', ParseUUIDPipe) courseId: string,
  ) {
    return await this.lecturerService.viewCourseScores(lecturerId, courseId);
  }

  @Get('courses/:courseId/students')
  @ApiOperation({ summary: 'List students enrolled in a course' })
  @ApiParam({ name: 'courseId', type: String, description: 'Course UUID' })
  @ApiOkResponse({
    description: 'Course students retrieved successfully',
    type: () => [EnrollmentResponse],
  })
  @ApiNotFoundResponse({ description: 'Course not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async listCourseStudents(
    @User('id') lecturerId: string,
    @Param('courseId', ParseUUIDPipe) courseId: string,
  ) {
    return await this.lecturerService.listCourseStudents(lecturerId, courseId);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get lecturer profile' })
  @ApiOkResponse({
    description: 'Profile retrieved successfully',
    type: () => LecturerProfileResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async getProfile(@User('id') lecturerId: string) {
    return await this.lecturerService.getProfile(lecturerId);
  }
}
