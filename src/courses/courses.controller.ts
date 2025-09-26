import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpsertCourseBody } from './courses.schema';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  async createCourse(@Body() body: UpsertCourseBody) {
    return await this.coursesService.createCourse(body);
  }

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

  @Get()
  async getCourses() {
    return await this.coursesService.getCourses();
  }

  @Patch(':courseId')
  async updateCourse(
    @Param('courseId') courseId: string,
    @Body() body: UpsertCourseBody,
  ) {
    return await this.coursesService.updateCourse(courseId, body);
  }
}
