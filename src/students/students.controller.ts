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
import { StudentsService } from './students.service';
import { UserRole } from 'src/auth/auth.schema';
import { Role, RoleGuard } from 'src/auth/role.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateStudentBody } from './students.schema';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('students')
@Role(UserRole.ADMIN)
@UseGuards(JwtAuthGuard, RoleGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  async createStudent(@Body() body: CreateStudentBody) {
    return await this.studentsService.createStudent(body);
  }

  @Post('batch')
  @UseInterceptors(FileInterceptor('file'))
  async createStudents(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 5 * 1024 })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
  ) {
    return await this.studentsService.createStudents(file);
  }

  @Get()
  async getStudents() {
    return await this.studentsService.getStudents();
  }
}
