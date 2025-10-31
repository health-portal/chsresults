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
} from '@nestjs/common';
import { LecturersService } from './lecturers.service';
import {
  CreateLecturerBody,
  CreateLecturersRes,
  UpdateLecturerBody,
  LecturerProfileRes,
} from './lecturers.schema';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiConflictResponse,
  ApiUnprocessableEntityResponse,
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import { AuthRole, UserRoleGuard } from 'src/auth/role.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserRole } from '@prisma/client';

@ApiTags('Lecturers', 'Admin')
@ApiBearerAuth('accessToken')
@Controller('lecturers')
@AuthRole(UserRole.ADMIN)
@UseGuards(JwtAuthGuard, UserRoleGuard)
export class LecturersController {
  constructor(private readonly lecturersService: LecturersService) {}

  @ApiOperation({ summary: 'Create a new lecturer' })
  @ApiBody({ type: CreateLecturerBody })
  @ApiCreatedResponse({ description: 'Lecturer created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  @ApiConflictResponse({ description: 'Lecturer already exists.' })
  @Post()
  async createLecturer(@Body() body: CreateLecturerBody) {
    return await this.lecturersService.createLecturer(body);
  }

  @ApiOperation({ summary: 'Create multiple lecturers from a file' })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ type: CreateLecturersRes })
  @ApiUnprocessableEntityResponse({ description: 'Invalid file data or size' })
  @Post('batch')
  async createLecturers(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 5 * 1024 })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
  ) {
    await this.lecturersService.createLecturers(file);
  }

  @ApiOperation({ summary: 'Get all lecturers' })
  @ApiOkResponse({ type: [LecturerProfileRes] })
  @Get()
  async getLecturers() {
    return await this.lecturersService.getLecturers();
  }

  @ApiOperation({ summary: 'Update a lecturer' })
  @ApiOkResponse({ description: 'Lecturer updated successfully' })
  @ApiConflictResponse({ description: 'Lecturer data already exists' })
  @ApiNotFoundResponse({ description: 'Lecturer not found' })
  @Patch(':lecturerId')
  async updateLecturer(
    @Param('lecturerId', ParseUUIDPipe) lecturerId: string,
    @Body() body: UpdateLecturerBody,
  ) {
    return await this.lecturersService.updateLecturer(lecturerId, body);
  }

  @ApiOperation({ summary: 'Delete a lecturer' })
  @ApiOkResponse({ description: 'Lecturer deleted successfully' })
  @ApiNotFoundResponse({ description: 'Lecturer not found' })
  @Delete(':lecturerId')
  async deleteLecturer(@Param('lecturerId', ParseUUIDPipe) lecturerId: string) {
    return await this.lecturersService.deleteLecturer(lecturerId);
  }
}
