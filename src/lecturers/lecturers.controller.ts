import {
  Body,
  Controller,
  Get,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LecturersService } from './lecturers.service';
import { UserRole } from 'src/auth/auth.schema';
import { Role, RoleGuard } from 'src/auth/role.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateLecturerBody } from './lecturers.schema';

@Controller('lecturers')
@Role(UserRole.ADMIN)
@UseGuards(JwtAuthGuard, RoleGuard)
export class LecturersController {
  constructor(private readonly lecturersService: LecturersService) {}

  @Post()
  async createLecturer(@Body() body: CreateLecturerBody) {
    return await this.lecturersService.createLecturer(body);
  }

  @Post('batch')
  @UseInterceptors(FileInterceptor('file'))
  async createLecturers(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 5 * 1024 })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
  ) {
    return await this.lecturersService.createLecturers(file);
  }

  @Get()
  async getLecturers() {
    return await this.lecturersService.getLecturers();
  }
}
