import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDepartmentBody, CreateFacultyBody } from './college.schema';

@Injectable()
export class CollegeService {
  constructor(private readonly prisma: PrismaService) {}

  async getFacultiesAndDepartments() {
    return await this.prisma.faculty.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        name: true,
        departments: {
          where: { deletedAt: null },
          select: {
            id: true,
            name: true,
            shortName: true,
            maxLevel: true,
          },
        },
      },
    });
  }

  async createFaculty({ name }: CreateFacultyBody) {
    await this.prisma.faculty.create({ data: { name } });
  }

  async deleteFaculty(facultyId: string) {
    await this.prisma.faculty.update({
      where: { id: facultyId },
      data: { deletedAt: new Date() },
    });
  }

  async createDepartment({
    facultyId,
    name,
    shortName,
    maxLevel,
  }: CreateDepartmentBody) {
    await this.prisma.department.create({
      data: { facultyId, name, shortName, maxLevel },
    });
  }

  async deleteDepartment(deptId: string) {
    await this.prisma.department.update({
      where: { id: deptId },
      data: { deletedAt: new Date() },
    });
  }
}
