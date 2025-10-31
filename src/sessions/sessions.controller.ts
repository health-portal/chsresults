import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import {
  AssignDeptAndLevelBody,
  AssignLecturersBody,
  CreateSessionBody,
  SessionRes,
  SessionWithCoursesRes,
} from './sessions.schema';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthRole, UserRoleGuard } from 'src/auth/role.guard';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Sessions', 'Admin')
@ApiBearerAuth('accessToken')
@Controller('sessions')
@AuthRole(UserRole.ADMIN)
@UseGuards(JwtAuthGuard, UserRoleGuard)
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new session' })
  @ApiCreatedResponse({ description: 'Session created successfully' })
  @ApiConflictResponse({ description: 'Session already exists' })
  async createSession(@Body() body: CreateSessionBody) {
    return await this.sessionsService.createSession(body);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sessions' })
  @ApiOkResponse({ type: [SessionRes] })
  async getSessions() {
    return await this.sessionsService.getSessions();
  }

  @Get(':sessionId')
  @ApiOperation({ summary: 'Get a session' })
  @ApiOkResponse({ type: SessionWithCoursesRes })
  @ApiNotFoundResponse({ description: 'Session not found' })
  async getSession(@Param('sessionId') sessionId: string) {
    return await this.sessionsService.getSession(sessionId);
  }

  @Post(':sessionId/courses/:courseId/lecturers')
  @ApiOperation({ summary: 'Assign lecturers to a course' })
  @ApiCreatedResponse({ description: 'Lecturers assigned successfully' })
  @ApiBadRequestResponse({
    description: 'Invalid session or course or lecturer information',
  })
  async assignLecturersToCourse(
    @Param('sessionId') sessionId: string,
    @Param('courseId') courseId: string,
    @Body() body: AssignLecturersBody,
  ) {
    return await this.sessionsService.assignLecturersToCourse(
      sessionId,
      courseId,
      body,
    );
  }

  @Post(':sessionId/courses/:courseId/depts-and-levels')
  @ApiOperation({ summary: 'Assign departments and levels to a course' })
  @ApiCreatedResponse({
    description: 'Departments and levels assigned successfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid session or course or department or level information',
  })
  async assignDeptsAndLevelsToCourse(
    @Param('sessionId') sessionId: string,
    @Param('courseId') courseId: string,
    @Body() body: AssignDeptAndLevelBody[],
  ) {
    return await this.sessionsService.assignDeptsAndLevelsToCourse(
      sessionId,
      courseId,
      body,
    );
  }
}
