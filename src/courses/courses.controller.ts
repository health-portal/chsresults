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
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CoursesService } from './courses.service';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  async createCourse() {}

  @Post('batch')
  @UseInterceptors(FileInterceptor('file'))
  async createCourses(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 5 * 1024 })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
  ) {}

  @Get()
  async getCourses() {}

  @Patch(':courseId')
  async updateCourse(@Param('courseId') courseId: string) {}

  @Delete(':courseId')
  async deleteCourse(@Param('courseId') courseId: string) {}
}
