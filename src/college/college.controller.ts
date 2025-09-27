import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CollegeService } from './college.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role, RoleGuard } from 'src/auth/role.guard';
import { UserRole } from 'src/auth/auth.schema';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import {
  CreateDepartmentBody,
  UpsertFacultyAndDepartmentBody,
  FacultyResponse,
  DepartmentResponse,
  GetDepartmentsResponse,
} from './college.schema';

@ApiTags('College', 'Admin')
@ApiBearerAuth('accessToken')
@Controller('college')
@Role(UserRole.ADMIN)
@UseGuards(JwtAuthGuard, RoleGuard)
export class CollegeController {
  constructor(private readonly collegeService: CollegeService) {}

  @Get('departments')
  @ApiOperation({ summary: 'Get all faculties with departments' })
  @ApiOkResponse({ type: () => [GetDepartmentsResponse] })
  async getDepartments() {
    return await this.collegeService.getDepartments();
  }

  @Post('faculties')
  @ApiOperation({ summary: 'Create a faculty' })
  @ApiBody({ type: () => UpsertFacultyAndDepartmentBody })
  @ApiCreatedResponse({ type: () => FacultyResponse })
  async createFaculty(@Body() body: UpsertFacultyAndDepartmentBody) {
    return await this.collegeService.createFaculty(body);
  }

  @Patch('faculties/:facultyId')
  @ApiOperation({ summary: 'Update faculty name' })
  @ApiParam({ name: 'facultyId', type: String, description: 'Faculty UUID' })
  @ApiBody({ type: () => UpsertFacultyAndDepartmentBody })
  @ApiOkResponse({ type: () => FacultyResponse })
  @ApiNotFoundResponse({ description: 'Faculty not found' })
  async updateFaculty(
    @Param('facultyId', ParseUUIDPipe) facultyId: string,
    @Body() body: UpsertFacultyAndDepartmentBody,
  ) {
    return await this.collegeService.updateFaculty(facultyId, body);
  }

  @Delete('faculties/:facultyId')
  @ApiOperation({ summary: 'Delete a faculty' })
  @ApiParam({ name: 'facultyId', type: String, description: 'Faculty UUID' })
  @ApiOkResponse({ description: 'Faculty deleted successfully' })
  @ApiNotFoundResponse({ description: 'Faculty not found' })
  async deleteFaculty(@Param('facultyId', ParseUUIDPipe) facultyId: string) {
    return await this.collegeService.deleteFaculty(facultyId);
  }

  @Post('departments')
  @ApiOperation({ summary: 'Create a department under a faculty' })
  @ApiBody({ type: () => CreateDepartmentBody })
  @ApiCreatedResponse({ type: () => DepartmentResponse })
  async createDepartment(@Body() body: CreateDepartmentBody) {
    return await this.collegeService.createDepartment(body);
  }

  @Patch('departments/:deptId')
  @ApiOperation({ summary: 'Update department name' })
  @ApiParam({ name: 'deptId', type: String, description: 'Department UUID' })
  @ApiBody({ type: () => UpsertFacultyAndDepartmentBody })
  @ApiOkResponse({ type: () => DepartmentResponse })
  @ApiNotFoundResponse({ description: 'Department not found' })
  async updateDepartment(
    @Param('deptId', ParseUUIDPipe) deptId: string,
    @Body() body: UpsertFacultyAndDepartmentBody,
  ) {
    return await this.collegeService.updateDepartment(deptId, body);
  }

  @Delete('departments/:deptId')
  @ApiOperation({ summary: 'Delete a department' })
  @ApiParam({ name: 'deptId', type: String, description: 'Department UUID' })
  @ApiOkResponse({ description: 'Department deleted successfully' })
  @ApiNotFoundResponse({ description: 'Department not found' })
  async deleteDepartment(@Param('deptId', ParseUUIDPipe) deptId: string) {
    return await this.collegeService.deleteDepartment(deptId);
  }
}
