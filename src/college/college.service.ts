import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDepartmentBody, CreateFacultyBody } from './college.schema';

@Injectable()
export class CollegeService {
  constructor(private readonly prisma: PrismaService) {}

  async getFacultiesAndDepartments() {
    return await this.prisma.faculty.findMany({
      include: { departments: true },
    });
  }

  async createFaculty({ name }: CreateFacultyBody) {
    return await this.prisma.faculty.create({ data: { name } });
  }

  async deleteFaculty(facultyId: string) {
    const faculty = await this.prisma.faculty
      .delete({
        where: { id: facultyId },
      })
      .catch(() => null);

    if (!faculty) throw new NotFoundException('Faculty not found');
    return faculty;
  }

  async createDepartment({
    facultyId,
    name,
    shortName,
    maxLevel,
  }: CreateDepartmentBody) {
    return await this.prisma.department.create({
      data: { facultyId, name, shortName, maxLevel },
    });
  }

  async deleteDepartment(deptId: string) {
    const dept = await this.prisma.department.update({
      where: { id: deptId },
      data: { deletedAt: new Date() },
    });

    if (!dept) throw new NotFoundException('Department not found');
    return dept;
  }
}
