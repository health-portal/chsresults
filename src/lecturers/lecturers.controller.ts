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
import { LecturersService } from './lecturers.service';
import { UserRole } from 'src/auth/auth.schema';
import { Role, RoleGuard } from 'src/auth/role.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateLecturerBody, UpdateLecturerBody } from './lecturers.schema';
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

@ApiTags('Lecturers')
@ApiBearerAuth()
@Controller('lecturers')
@Role(UserRole.ADMIN)
@UseGuards(JwtAuthGuard, RoleGuard)
export class LecturersController {
  constructor(private readonly lecturersService: LecturersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new lecturer' })
  @ApiBody({ type: CreateLecturerBody })
  @ApiCreatedResponse({ description: 'Lecturer created successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async createLecturer(@Body() body: CreateLecturerBody) {
    return await this.lecturersService.createLecturer(body);
  }

  @Post('batch')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Create multiple lecturers via file upload' })
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
  @ApiCreatedResponse({ description: 'Lecturers created successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid file or file size exceeds 5KB',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
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
  @ApiOperation({ summary: 'Get all lecturers' })
  @ApiOkResponse({ description: 'Lecturers retrieved successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async getLecturers() {
    return await this.lecturersService.getLecturers();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a lecturer' })
  @ApiParam({ name: 'id', type: String, description: 'Lecturer UUID' })
  @ApiBody({ type: UpdateLecturerBody })
  @ApiOkResponse({ description: 'Lecturer updated successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Lecturer not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async updateLecturer(
    @Param('id', ParseUUIDPipe) lecturerId: string,
    @Body() body: UpdateLecturerBody,
  ) {
    return await this.lecturersService.updateLecturer(lecturerId, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a lecturer' })
  @ApiParam({ name: 'id', type: String, description: 'Lecturer UUID' })
  @ApiOkResponse({ description: 'Lecturer deleted successfully' })
  @ApiNotFoundResponse({ description: 'Lecturer not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async deleteLecturer(@Param('id', ParseUUIDPipe) lecturerId: string) {
    return await this.lecturersService.deleteLecturer(lecturerId);
  }
}
