import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateCourseBody,
  CreateCoursesResult,
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
    const result: CreateCoursesResult = { courses: [], ...parsedData };

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
      } catch (error) {
        result.courses.push({ ...row, isCreated: false });
      }
    }

    return result;
  }

  async getCourses() {
    return await this.prisma.course.findMany({
      where: { deletedAt: null },
      include: {
        courseSessions: true,
        department: true,
      },
    });
  }

  async updateCourse(
    courseId: string,
    { title, description }: UpdateCourseBody,
  ) {
    return this.prisma.course.update({
      where: { id: courseId },
      data: { title, description },
    });
  }

  async deleteCourse(courseId: string) {
    return this.prisma.course.update({
      where: { id: courseId },
      data: { deletedAt: new Date() },
    });
  }
}
