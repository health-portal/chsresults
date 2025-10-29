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
import {
  CreateStudentBody,
  StudentRes,
  UpdateStudentBody,
} from './students.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserRole } from '@prisma/client';
import { StudentsService } from './students.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

@ApiTags('Students', 'Admin')
@Controller('students')
@AuthRole(UserRole.ADMIN)
@UseGuards(JwtAuthGuard, UserRoleGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @ApiOperation({ summary: 'Create a new student' })
  @ApiCreatedResponse({
    description: 'The student has been successfully created.',
  })
  @ApiConflictResponse({
    description: 'The student already exists.',
  })
  @Post()
  async createStudent(@Body() body: CreateStudentBody) {
    return await this.studentsService.createStudent(body);
  }

  @ApiOperation({ summary: 'Create multiple students from a CSV file' })
  @ApiCreatedResponse({
    description: 'The students have been successfully created.',
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid CSV file',
  })
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

  @ApiOperation({ summary: 'Get all students' })
  @ApiOkResponse({ type: [StudentRes] })
  @Get()
  async getStudents() {
    return await this.studentsService.getStudents();
  }

  @ApiOperation({ summary: 'Get a student' })
  @ApiParam({
    name: 'studentId',
    description: 'The ID of the student to get',
  })
  @ApiOkResponse({ type: StudentRes })
  @ApiNotFoundResponse({ description: 'The student does not exist.' })
  @Get(':studentId')
  async getStudent(@Param('studentId', ParseUUIDPipe) studentId: string) {
    return await this.studentsService.getStudent(studentId);
  }

  @ApiOperation({ summary: 'Update a student' })
  @ApiParam({
    name: 'studentId',
    description: 'The ID of the student to update',
  })
  @ApiBody({ type: UpdateStudentBody })
  @ApiOkResponse({ description: 'The student has been successfully updated.' })
  @ApiNotFoundResponse({ description: 'The student does not exist.' })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  @Patch(':studentId')
  async updateStudent(
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Body() body: UpdateStudentBody,
  ) {
    return await this.studentsService.updateStudent(studentId, body);
  }

  @ApiOperation({ summary: 'Delete a student' })
  @ApiParam({
    name: 'studentId',
    description: 'The ID of the student to delete',
  })
  @ApiOkResponse({ description: 'The student has been successfully deleted.' })
  @ApiNotFoundResponse({ description: 'The student does not exist.' })
  @Delete(':studentId')
  async deleteStudent(@Param('studentId', ParseUUIDPipe) studentId: string) {
    return await this.studentsService.deleteStudent(studentId);
  }
}
