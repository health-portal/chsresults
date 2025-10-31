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
  CreateStudentsRes,
  StudentProfileRes,
  UpdateStudentBody,
} from './students.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserRole } from '@prisma/client';
import { StudentsService } from './students.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

@ApiTags('Students', 'Admin')
@ApiBearerAuth('accessToken')
@Controller('students')
@AuthRole(UserRole.ADMIN)
@UseGuards(JwtAuthGuard, UserRoleGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @ApiOperation({ summary: 'Create a new student' })
  @ApiCreatedResponse({ description: 'Student created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  @ApiConflictResponse({ description: 'Student already exists.' })
  @Post()
  async createStudent(@Body() body: CreateStudentBody) {
    return await this.studentsService.createStudent(body);
  }

  @ApiOperation({ summary: 'Create multiple students from a file' })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ type: CreateStudentsRes })
  @ApiUnprocessableEntityResponse({ description: 'Invalid file data or size' })
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
  @ApiOkResponse({ type: [StudentProfileRes] })
  @Get()
  async getStudents() {
    return await this.studentsService.getStudents();
  }

  @ApiOperation({ summary: 'Get a student' })
  @ApiParam({
    name: 'studentId',
    description: 'The ID of Student to get',
  })
  @ApiOkResponse({ type: StudentProfileRes })
  @ApiNotFoundResponse({ description: 'Student not found' })
  @Get(':studentId')
  async getStudent(@Param('studentId', ParseUUIDPipe) studentId: string) {
    return await this.studentsService.getStudent(studentId);
  }

  @ApiOperation({ summary: 'Update a student' })
  @ApiParam({
    name: 'studentId',
    description: 'The ID of Student to update',
  })
  @ApiBody({ type: UpdateStudentBody })
  @ApiOkResponse({ description: 'Student updated successfully' })
  @ApiNotFoundResponse({ description: 'Student not found' })
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
    description: 'The ID of Student to delete',
  })
  @ApiOkResponse({ description: 'Student deleted successfully' })
  @ApiNotFoundResponse({ description: 'Student does not exist.' })
  @Delete(':studentId')
  async deleteStudent(@Param('studentId', ParseUUIDPipe) studentId: string) {
    return await this.studentsService.deleteStudent(studentId);
  }
}
