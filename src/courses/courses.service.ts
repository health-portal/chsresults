import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateCourseBody,
  CreateCoursesRes,
  UpdateCourseBody,
} from './courses.schema';
import { parseCsv } from 'src/lib/csv';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

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
    try {
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
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Course already exists');
        }
      }
      throw new BadRequestException(error);
    }
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
    const foundCourses = await this.prisma.course.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        code: true,
        title: true,
        description: true,
        semester: true,
        units: true,
        department: { select: { name: true } },
      },
    });

    return foundCourses.map((course) => ({
      ...course,
      department: course.department.name,
    }));
  }

  async getCourse(courseId: string) {
    try {
      const foundCourse = await this.prisma.course.findUnique({
        where: { id: courseId },
        select: {
          id: true,
          code: true,
          title: true,
          description: true,
          semester: true,
          units: true,
          department: { select: { name: true } },
        },
      });

      return foundCourse;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Course not found');
        }
      }

      throw new BadRequestException(error);
    }
  }

  async updateCourse(
    courseId: string,
    { title, description }: UpdateCourseBody,
  ) {
    try {
      await this.prisma.course.update({
        where: { id: courseId },
        data: { title, description },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Course not found');
        }
      }

      throw new BadRequestException(error);
    }
  }

  async deleteCourse(courseId: string) {
    try {
      await this.prisma.course.update({
        where: { id: courseId },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Course not found');
        }
      }

      throw new BadRequestException(error);
    }
  }
}
