import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CollegeService } from './college.service';
import {
  CreateDepartmentBody,
  UpsertFacultyAndDepartmentBody,
} from './college.schema';

@Controller('college')
export class CollegeController {
  constructor(private readonly collegeService: CollegeService) {}

  @Get()
  async getFacultiesAndDepartments() {
    return await this.collegeService.getFacultiesAndDepartments();
  }

  @Post('faculties')
  async createFaculty(@Body() body: UpsertFacultyAndDepartmentBody) {
    return await this.collegeService.createFaculty(body);
  }

  @Patch('faculties/:facultyId')
  async updateFaculty(
    @Param('facultyId', ParseUUIDPipe) facultyId: string,
    @Body() body: UpsertFacultyAndDepartmentBody,
  ) {
    return await this.collegeService.updateFaculty(facultyId, body);
  }

  @Delete('faculties/:facultyId')
  async deleteFaculty(@Param('facultyId', ParseUUIDPipe) facultyId: string) {
    return await this.collegeService.deleteFaculty(facultyId);
  }

  @Post('departments')
  async createDepartment(@Body() body: CreateDepartmentBody) {
    return await this.collegeService.createDepartment(body);
  }

  @Patch('departments/:deptId')
  async updateDepartment(
    @Param('deptId', ParseUUIDPipe) deptId: string,
    @Body() body: UpsertFacultyAndDepartmentBody,
  ) {
    return await this.collegeService.updateDepartment(deptId, body);
  }

  @Delete('departments/:deptId')
  async deleteDepartment(@Param('deptId', ParseUUIDPipe) deptId: string) {
    return await this.collegeService.deleteDepartment(deptId);
  }
}
