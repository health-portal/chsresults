import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  UpsertFacultyAndDepartmentBody,
  CreateDepartmentBody,
  CreateSessionBody,
} from './college.schema';

@Injectable()
export class CollegeService {
  constructor(private readonly prisma: PrismaService) {}

  async getFacultiesAndDepartments() {
    return await this.prisma.faculty.findMany({
      include: { departments: true },
    });
  }

  async createFaculty(body: UpsertFacultyAndDepartmentBody) {
    return await this.prisma.faculty.create({ data: body });
  }

  async updateFaculty(facultyId: string, body: UpsertFacultyAndDepartmentBody) {
    const faculty = await this.prisma.faculty
      .update({
        where: { id: facultyId },
        data: body,
      })
      .catch(() => null);

    if (!faculty) throw new NotFoundException('Faculty not found');
    return faculty;
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

  async createDepartment({ facultyId, name }: CreateDepartmentBody) {
    return await this.prisma.department.create({
      data: { facultyId, name },
    });
  }

  async updateDepartment(deptId: string, body: UpsertFacultyAndDepartmentBody) {
    const dept = await this.prisma.department
      .update({
        where: { id: deptId },
        data: body,
      })
      .catch(() => null);

    if (!dept) throw new NotFoundException('Department not found');
    return dept;
  }

  async deleteDepartment(deptId: string) {
    const dept = await this.prisma.department
      .delete({
        where: { id: deptId },
      })
      .catch(() => null);

    if (!dept) throw new NotFoundException('Department not found');
    return dept;
  }

  async createSession({ academicYear, startDate, endDate }: CreateSessionBody) {
    const foundSession = await this.prisma.session.findFirst({
      where: {
        AND: { startDate: { lte: startDate }, endDate: { gte: endDate } },
      },
    });
    if (foundSession) throw new ConflictException('Session already exists');

    return await this.prisma.session.create({
      data: { academicYear, startDate, endDate },
    });
  }

  async getSessions() {
    const foundSessions = await this.prisma.session.findMany({
      orderBy: { endDate: 'desc' },
    });
    return foundSessions;
  }

  async getCurrentSession() {
    const foundSession = await this.prisma.session.findFirst({
      orderBy: { endDate: 'desc' },
      where: {
        AND: { endDate: { gte: new Date() }, startDate: { lte: new Date() } },
      },
    });
    if (!foundSession) throw new NotFoundException('Current session not found');
    return foundSession;
  }
}
