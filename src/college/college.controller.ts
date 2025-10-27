import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CollegeService } from './college.service';
import { CreateDepartmentBody, CreateFacultyBody } from './college.schema';
import { AuthRole, UserRoleGuard } from 'src/auth/role.guard';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('college')
@AuthRole(UserRole.ADMIN)
@UseGuards(JwtAuthGuard, UserRoleGuard)
export class CollegeController {
  constructor(private readonly collegeService: CollegeService) {}

  @Get()
  async getFacultiesAndDepartments() {
    return await this.collegeService.getFacultiesAndDepartments();
  }

  @Post('faculties')
  async createFaculty(@Body() body: CreateFacultyBody) {
    return await this.collegeService.createFaculty(body);
  }

  @Delete('faculties/:facultyId')
  async deleteFaculty(@Param('facultyId', ParseUUIDPipe) facultyId: string) {
    return await this.collegeService.deleteFaculty(facultyId);
  }

  @Post('departments')
  async createDepartment(@Body() body: CreateDepartmentBody) {
    return await this.collegeService.createDepartment(body);
  }

  @Delete('departments/:deptId')
  async deleteDepartment(@Param('deptId', ParseUUIDPipe) deptId: string) {
    return await this.collegeService.deleteDepartment(deptId);
  }
}
