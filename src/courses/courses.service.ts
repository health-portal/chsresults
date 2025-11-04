import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateCourseBody,
  CreateCoursesRes,
  UpdateCourseBody,
} from './courses.schema';
import { parseCsv } from 'src/lib/csv';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async createCourse({
    code,
    title,
    description,
    department,
    semester,
    units,
  }: CreateCourseBody) {
    await this.prisma.course.create({
      data: {
        code,
        title,
        description,
        department: { connect: { name: department } },
        semester,
        units,
      },
    });
  }

  async createCourses(file: Express.Multer.File) {
    const content = file.buffer.toString('utf-8');
    const parsedData = await parseCsv(content, CreateCourseBody);
    const result: CreateCoursesRes = { courses: [], ...parsedData };

    for (const row of parsedData.validRows) {
      try {
        await this.prisma.course.create({
          data: {
            code: row.code,
            title: row.title,
            description: row.description,
            department: { connect: { name: row.department } },
            semester: row.semester,
            units: row.units,
          },
        });
        result.courses.push({ ...row, isCreated: true });
      } catch {
        result.courses.push({ ...row, isCreated: false });
      }
    }

    return result;
  }

  async getCourses() {
    return await this.prisma.course.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        code: true,
        title: true,
        description: true,
        semester: true,
        units: true,
        department: { select: { id: true, name: true, shortName: true } },
      },
    });
  }

  async getCourse(courseId: string) {
    return await this.prisma.course.findUniqueOrThrow({
      where: { id: courseId },
      select: {
        id: true,
        code: true,
        title: true,
        description: true,
        semester: true,
        units: true,
        department: { select: { id: true, name: true, shortName: true } },
      },
    });
  }

  async updateCourse(
    courseId: string,
    { title, description }: UpdateCourseBody,
  ) {
    await this.prisma.course.update({
      where: { id: courseId },
      data: { title, description },
    });
  }

  async deleteCourse(courseId: string) {
    await this.prisma.course.update({
      where: { id: courseId },
      data: { deletedAt: new Date() },
    });
  }
}
