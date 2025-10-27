import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import {
  AssignDepartmentAndLevelBody,
  AssignLecturersBody,
  CreateSessionBody,
  SessionResponse,
} from './sessions.schema';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Sessions', 'Admin')
@Controller('sessions')
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
  @ApiOkResponse({ type: [SessionResponse] })
  async getSessions() {
    return await this.sessionsService.getSessions();
  }

  @Get('current')
  async getCurrentSession() {
    return await this.sessionsService.getCurrentSession();
  }

  @Post(':sessionId/courses/:courseId/lecturers')
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
  async assignDeptsAndLevelsToCourse(
    @Param('sessionId') sessionId: string,
    @Param('courseId') courseId: string,
    @Body() body: AssignDepartmentAndLevelBody[],
  ) {
    return await this.sessionsService.assignDeptsAndLevelsToCourse(
      sessionId,
      courseId,
      body,
    );
  }
}
