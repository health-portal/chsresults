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
import { StudentsService } from './students.service';
import { StudentProfileResponse, UserRole } from 'src/auth/auth.schema';
import { Role, RoleGuard } from 'src/auth/role.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  CreateStudentBody,
  CreateStudentsResponse,
  UpdateStudentBody,
} from './students.schema';
import { FileInterceptor } from '@nestjs/platform-express';
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
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';

@ApiTags('Students', 'Admin')
@ApiBearerAuth('accessToken')
@Controller('students')
@Role(UserRole.ADMIN)
@UseGuards(JwtAuthGuard, RoleGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new student' })
  @ApiBody({ type: () => CreateStudentBody })
  @ApiCreatedResponse({
    description: 'Student created successfully',
    type: () => StudentProfileResponse,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async createStudent(@Body() body: CreateStudentBody) {
    return await this.studentsService.createStudent(body);
  }

  @Post('batch')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Create multiple students via file upload' })
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
    description: 'Students created successfully',
    type: () => CreateStudentsResponse,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid file or file size exceeds 5KB',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
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
  @ApiOperation({ summary: 'Get all students' })
  @ApiOkResponse({
    description: 'Students retrieved successfully',
    type: () => [StudentProfileResponse],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async getStudents() {
    return await this.studentsService.getStudents();
  }

  @Patch(':studentId')
  @ApiOperation({ summary: 'Update a student' })
  @ApiParam({ name: 'id', type: String, description: 'Student UUID' })
  @ApiBody({ type: () => UpdateStudentBody })
  @ApiOkResponse({
    description: 'Student updated successfully',
    type: () => StudentProfileResponse,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Student not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async updateStudent(
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Body() body: UpdateStudentBody,
  ) {
    return await this.studentsService.updateStudent(studentId, body);
  }

  @Delete(':studentId')
  @ApiOperation({ summary: 'Delete a student' })
  @ApiParam({ name: 'studentId', type: String, description: 'Student UUID' })
  @ApiOkResponse({
    description: 'Student deleted successfully',
    type: () => StudentProfileResponse,
  })
  @ApiNotFoundResponse({ description: 'Student not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async deleteStudent(@Param('id', ParseUUIDPipe) studentId: string) {
    return await this.studentsService.deleteStudent(studentId);
  }
}
