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
} from '@nestjs/common';
import { LecturersService } from './lecturers.service';
import {
  CreateLecturerBody,
  CreateLecturersRes,
  UpdateLecturerBody,
} from './lecturers.schema';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

@Controller('lecturers')
export class LecturersController {
  constructor(private readonly lecturersService: LecturersService) {}

  @ApiOperation({ summary: 'Create a new lecturer' })
  @ApiBody({ type: CreateLecturerBody })
  @ApiCreatedResponse({ description: 'Lecturer created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  @Post()
  async createLecturer(@Body() body: CreateLecturerBody) {
    return await this.lecturersService.createLecturer(body);
  }

  @ApiOperation({ summary: 'Create multiple lecturers from a CSV file' })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ type: CreateLecturersRes })
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
  @ApiOkResponse({ description: 'Lecturers retrieved successfully' })
  @Get()
  async getLecturers() {
    return await this.lecturersService.getLecturers();
  }

  @ApiOperation({ summary: 'Update a lecturer' })
  @ApiOkResponse({ description: 'Lecturer updated successfully' })
  @Patch(':lecturerId')
  async updateLecturer(
    @Param('lecturerId', ParseUUIDPipe) lecturerId: string,
    @Body() body: UpdateLecturerBody,
  ) {
    return await this.lecturersService.updateLecturer(lecturerId, body);
  }

  @ApiOperation({ summary: 'Delete a lecturer' })
  @ApiOkResponse({ description: 'Lecturer deleted successfully' })
  @Delete(':lecturerId')
  async deleteLecturer(@Param('lecturerId', ParseUUIDPipe) lecturerId: string) {
    return await this.lecturersService.deleteLecturer(lecturerId);
  }
}
