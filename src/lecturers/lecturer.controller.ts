import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LecturerService } from './lecturer.service';
import { User } from 'src/auth/user.decorator';
import { AuthRoles, UserRoleGuard } from 'src/auth/role.guard';
import { UserRole } from 'prisma/client/database';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LecturerData } from 'src/auth/auth.schema';
import type { JwtPayload } from 'src/auth/auth.schema';
import {
  CourseSessionRes,
  EditResultBody,
  RegisterStudentBody,
  LecturerProfileRes,
  EnrollmentRes,
} from './lecturers.schema';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Lecturer')
@ApiBearerAuth('accessToken')
@Controller('lecturer')
@AuthRoles([UserRole.LECTURER])
@UseGuards(JwtAuthGuard, UserRoleGuard)
export class LecturerController {
  constructor(private readonly lecturerService: LecturerService) {}

  private getLecturerId(user: JwtPayload) {
    const lecturerData = user.userData as LecturerData;
    return lecturerData.lecturerId;
  }

  @ApiOperation({ summary: 'List courses' })
  @ApiOkResponse({ type: [CourseSessionRes] })
  @Get('courses-sessions')
  async listCourseSessions(@User() user: JwtPayload) {
    const lecturerId = this.getLecturerId(user);
    return this.lecturerService.listCourseSessions(lecturerId);
  }

  @ApiOperation({ summary: 'Register a student in a course session' })
  @ApiOkResponse({ description: 'Student registered successfully' })
  @ApiForbiddenResponse({
    description:
      'You are not authorized to register students in this course session.',
  })
  @ApiConflictResponse({ description: 'Student already registered' })
  @ApiNotFoundResponse({ description: 'Student not found' })
  @Post('courses-sessions/:courseSessionId/students')
  @HttpCode(HttpStatus.OK)
  async registerStudent(
    @User() user: JwtPayload,
    @Param('courseSessionId', ParseUUIDPipe) courseSessionId: string,
    @Body() body: RegisterStudentBody,
  ) {
    const lecturerId = this.getLecturerId(user);
    return await this.lecturerService.registerStudent(
      lecturerId,
      courseSessionId,
      body,
    );
  }

  @ApiOperation({ summary: 'Register students in a course session' })
  @ApiForbiddenResponse({
    description:
      'You are not authorized to register students in this course session.',
  })
  @Post('courses-sessions/:courseSessionId/students/batch')
  async getRegisterStudentsUrl(
    @User() user: JwtPayload,
    @Param('courseSessionId', ParseUUIDPipe) courseSessionId: string,
  ) {
    const lecturerId = this.getLecturerId(user);
    return await this.lecturerService.getRegisterStudentsUrl(
      lecturerId,
      courseSessionId,
    );
  }

  @ApiOperation({ summary: 'Register a student in a course session' })
  @ApiOkResponse({ description: 'Student registered successfully' })
  @ApiForbiddenResponse({
    description:
      'You are not authorized to register students in this course session.',
  })
  @Post('courses-sessions/:courseSessionId/students')
  @UseInterceptors(FileInterceptor('file'))
  async getUploadResultsUrl(
    @User() user: JwtPayload,
    @Param('courseSessionId', ParseUUIDPipe) courseSessionId: string,
  ) {
    const lecturerId = this.getLecturerId(user);
    return await this.lecturerService.getUploadResultsUrl(
      lecturerId,
      courseSessionId,
    );
  }

  @ApiOperation({ summary: "Edit a student's score in a course session" })
  @ApiBody({ type: EditResultBody })
  @ApiOkResponse({ description: 'Result edited successfully' })
  @ApiNotFoundResponse({ description: 'Course session or student not found' })
  @Patch('courses-sessions/:courseSessionId/scores/:studentId')
  async editResult(
    @User() user: JwtPayload,
    @Param('courseSessionId', ParseUUIDPipe) courseSessionId: string,
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Body() body: EditResultBody,
  ) {
    const lecturerId = this.getLecturerId(user);
    return await this.lecturerService.editResult(
      lecturerId,
      courseSessionId,
      studentId,
      body,
    );
  }

  @ApiOperation({ summary: 'View scores for a course session' })
  @ApiOkResponse({ type: [EnrollmentRes] })
  @ApiNotFoundResponse({ description: 'Course session not found' })
  @Get('courses-sessions/:courseSessionId/scores')
  async viewCourseResults(
    @User() user: JwtPayload,
    @Param('courseSessionId', ParseUUIDPipe) courseSessionId: string,
  ) {
    const lecturerId = this.getLecturerId(user);
    return await this.lecturerService.viewCourseResults(
      lecturerId,
      courseSessionId,
    );
  }

  @ApiOperation({ summary: 'List students in a course session' })
  @ApiOkResponse({ type: [EnrollmentRes] })
  @ApiNotFoundResponse({ description: 'Course session not found' })
  @Get('course-sessions/:courseSessionId/students')
  async listCourseStudents(
    @User() user: JwtPayload,
    @Param('courseSessionId', ParseUUIDPipe) courseSessionId: string,
  ) {
    const lecturerId = this.getLecturerId(user);
    return await this.lecturerService.listCourseStudents(
      lecturerId,
      courseSessionId,
    );
  }

  @ApiOperation({ summary: 'Get lecturer profile' })
  @ApiOkResponse({ type: LecturerProfileRes })
  @ApiNotFoundResponse({ description: 'Lecturer not found' })
  @Get('profile')
  async getProfile(@User() user: JwtPayload) {
    const lecturerId = this.getLecturerId(user);
    return await this.lecturerService.getProfile(lecturerId);
  }
}
