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
import { CoursesService } from './courses.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  CourseResponse,
  CreateCoursesResponse,
  UpsertCourseBody,
} from './courses.schema';
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
} from '@nestjs/swagger';
import { Role, RoleGuard } from 'src/auth/role.guard';
import { UserRole } from 'src/auth/auth.schema';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Courses', 'Admin')
@ApiBearerAuth('accessToken')
@Controller('courses')
@Role(UserRole.ADMIN)
@UseGuards(JwtAuthGuard, RoleGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new course' })
  @ApiBody({ type: () => UpsertCourseBody })
  @ApiCreatedResponse({
    description: 'Course created successfully',
    type: () => CourseResponse,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async createCourse(@Body() body: UpsertCourseBody) {
    return await this.coursesService.createCourse(body);
  }

  @Post('batch')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Create multiple courses via file upload' })
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
    description: 'Courses created successfully',
    type: () => CreateCoursesResponse,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid file or file size exceeds 5KB',
  })
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

  @Get()
  @ApiOperation({ summary: 'Get all courses' })
  @ApiOkResponse({
    description: 'Courses retrieved successfully',
    type: () => [CourseResponse],
  })
  async getCourses() {
    return await this.coursesService.getCourses();
  }

  @Patch(':courseId')
  @ApiOperation({ summary: 'Update a course' })
  @ApiParam({ name: 'courseId', type: String, description: 'Course ID' })
  @ApiBody({ type: () => UpsertCourseBody })
  @ApiOkResponse({
    description: 'Course updated successfully',
    type: () => CourseResponse,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Course not found' })
  async updateCourse(
    @Param('courseId') courseId: string,
    @Body() body: UpsertCourseBody,
  ) {
    return await this.coursesService.updateCourse(courseId, body);
  }

  @Delete(':courseId')
  @ApiOperation({ summary: 'Delete a course' })
  @ApiParam({ name: 'courseId', type: String, description: 'Course ID' })
  @ApiOkResponse({
    description: 'Course deleted successfully',
    type: () => CourseResponse,
  })
  @ApiNotFoundResponse({ description: 'Course not found' })
  async deleteCourse(@Param('courseId') courseId: string) {
    return await this.coursesService.deleteCourse(courseId);
  }
}
