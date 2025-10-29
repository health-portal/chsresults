import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDepartmentBody, CreateFacultyBody } from './college.schema';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

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
    try {
      await this.prisma.faculty.create({ data: { name } });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Faculty already exists');
        }
      }

      throw new BadRequestException(error);
    }
  }

  async deleteFaculty(facultyId: string) {
    try {
      await this.prisma.faculty
        .update({
          where: { id: facultyId },
          data: { deletedAt: new Date() },
        })
        .catch(() => null);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Faculty not found');
        }
      }

      throw new BadRequestException(error);
    }
  }

  async createDepartment({
    facultyId,
    name,
    shortName,
    maxLevel,
  }: CreateDepartmentBody) {
    try {
      await this.prisma.department.create({
        data: { facultyId, name, shortName, maxLevel },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Department already exists');
        }
      }

      throw new BadRequestException(error);
    }
  }

  async deleteDepartment(deptId: string) {
    try {
      await this.prisma.department.update({
        where: { id: deptId },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Department not found');
        }
      }

      throw new BadRequestException(error);
    }
  }
}
