import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import {
  CourseRes,
  CreateCourseBody,
  UpdateCourseBody,
} from './courses.schema';
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
import { UserRole } from 'prisma/client/database';
import { AuthRoles, UserRoleGuard } from 'src/auth/role.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Courses')
@ApiBearerAuth('accessToken')
@Controller('courses')
@AuthRoles([UserRole.ADMIN])
@UseGuards(JwtAuthGuard, UserRoleGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @ApiOperation({ summary: 'Create a new course' })
  @ApiCreatedResponse({ description: 'Course created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid course creation data' })
  @ApiConflictResponse({ description: 'Course already exists' })
  @Post()
  async createCourse(@Body() body: CreateCourseBody) {
    return await this.coursesService.createCourse(body);
  }

  @ApiOperation({ summary: 'Create multiple courses from a file' })
  @Post('batch')
  async getCreateCoursesUrls(@Query('filename') filename: string) {
    return await this.coursesService.getCreateCoursesUrls(filename);
  }

  @ApiOperation({ summary: 'Get all courses' })
  @ApiOkResponse({ type: [CourseRes] })
  @Get()
  async getCourses() {
    return await this.coursesService.getCourses();
  }

  @ApiOperation({ summary: 'Get a course by ID' })
  @ApiOkResponse({ type: CourseRes })
  @ApiNotFoundResponse({ description: 'Course not found' })
  @Get(':courseId')
  async getCourse(@Param('courseId') courseId: string) {
    return await this.coursesService.getCourse(courseId);
  }

  @ApiOperation({ summary: 'Update a course by ID' })
  @ApiOkResponse({ description: 'Course updated successfully' })
  @ApiNotFoundResponse({ description: 'Course not found' })
  @ApiConflictResponse({ description: 'Course already exists' })
  @Patch(':courseId')
  async updateCourse(
    @Param('courseId') courseId: string,
    @Body() body: UpdateCourseBody,
  ) {
    return await this.coursesService.updateCourse(courseId, body);
  }

  @ApiOperation({ summary: 'Delete a course by ID' })
  @ApiOkResponse({ description: 'Course deleted successfully' })
  @ApiNotFoundResponse({ description: 'Course not found' })
  @Delete(':courseId')
  async deleteCourse(@Param('courseId') courseId: string) {
    return await this.coursesService.deleteCourse(courseId);
  }
}
