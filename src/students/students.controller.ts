import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  ParseUUIDPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthRole, UserRoleGuard } from 'src/auth/role.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateStudentBody, UpdateStudentBody } from './students.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserRole } from '@prisma/client';
import { StudentsService } from './students.service';

@Controller('students')
@AuthRole(UserRole.ADMIN)
@UseGuards(JwtAuthGuard, UserRoleGuard)
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

  @Patch(':studentId')
  async updateStudent(
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Body() body: UpdateStudentBody,
  ) {
    return await this.studentsService.updateStudent(studentId, body);
  }

  @Delete(':studentId')
  async deleteStudent(@Param('studentId', ParseUUIDPipe) studentId: string) {
    return await this.studentsService.deleteStudent(studentId);
  }
}
