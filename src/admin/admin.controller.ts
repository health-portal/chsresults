import {
  Body,
  Controller,
  Post,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiConsumes,
} from '@nestjs/swagger';
import { Role, RoleGuard } from 'src/auth/role.guard';
import { EUserRole } from 'src/auth/auth.schema';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CourseBody, CourseResponse } from './admin.schema';
import { CreateStudentDto, CreateLecturerDto } from 'src/repository/schema';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('admin')
@Controller('admin')
@Role(EUserRole.admin)
@UseGuards(JwtAuthGuard, RoleGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('courses')
  @ApiOperation({ summary: 'Create a new course' })
  @ApiBody({ type: CourseBody })
  @ApiResponse({
    status: 201,
    description: 'Course details',
    type: CourseResponse,
  })
  @ApiResponse({})
  createCourse(@Body() body: CourseBody) {
    return this.adminService.createCourse(body);
  }

  @Post('lecturers')
  @ApiOperation({ summary: 'Add lecturers' })
  @ApiBody({ type: CreateLecturerDto })
  @ApiResponse({})
  createLecturers(@Body() body: CreateLecturerDto) {
    return this.adminService.createLecturers(body);
  }

  @Post('lecturers/batch')
  @ApiOperation({ summary: 'Add lecturers batch csv' })
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
  @ApiResponse({})
  @UseInterceptors(FileInterceptor('file'))
  createLecturersBatch(@UploadedFile() file: any) {
    return this.adminService.createLecturersBatch(file, 'admin-id'); // TODO: get from auth
  }

  @Post('students')
  @ApiOperation({ summary: 'Add students' })
  @ApiBody({ type: CreateStudentDto })
  @ApiResponse({})
  createStudents(@Body() body: CreateStudentDto) {
    return this.adminService.createStudents(body);
  }

  @Post('students/batch')
  @ApiOperation({ summary: 'Add students batch' })
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
  @ApiResponse({})
  @UseInterceptors(FileInterceptor('file'))
  createStudentsBatch(@UploadedFile() file: any) {
    return this.adminService.createStudentsBatch(file, 'admin-id'); // TODO: get from auth
  }
}
