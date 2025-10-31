import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CoursesService } from './courses.service';
import {
  CourseRes,
  CreateCourseBody,
  CreateCoursesRes,
  UpdateCourseBody,
} from './courses.schema';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { AuthRole, UserRoleGuard } from 'src/auth/role.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Courses')
@Controller('courses')
@AuthRole(UserRole.ADMIN)
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
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ type: [CreateCoursesRes] })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid file format or size',
  })
  @Post('batch')
  @UseInterceptors(FileInterceptor('file'))
  async createCourses(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 5 * 1024 })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
  ) {
    return await this.coursesService.createCourses(file);
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
