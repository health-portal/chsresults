import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UpsertCourseBody, CreateCoursesResponse } from './courses.schema';
import { eq, or } from 'drizzle-orm';
import { course, lecturer } from 'drizzle/schema';
import { parseCsvFile } from 'src/utils/csv';

@Injectable()
export class CoursesService {
  constructor(private readonly db: DatabaseService) {}

  async createCourse({
    code,
    title,
    lecturerEmail,
    semester,
    units,
  }: UpsertCourseBody) {
    const foundCourse = await this.db.client.query.course.findFirst({
      where: or(eq(course.title, title), eq(course.code, code)),
    });
    if (foundCourse)
      throw new BadRequestException(
        'Course with name or title already registered',
      );

    const foundLecturer = await this.db.client.query.lecturer.findFirst({
      where: eq(lecturer.email, lecturerEmail),
    });
    if (!foundLecturer) throw new BadRequestException('Lecturer not found');

    const [insertedCourse] = await this.db.client
      .insert(course)
      .values({ code, title, lecturerId: foundLecturer.id, semester, units })
      .returning();
    return insertedCourse;
  }

  async createCourses(file: Express.Multer.File) {
    const parsedData = await parseCsvFile(file, UpsertCourseBody);
    const result: CreateCoursesResponse = { courses: [], ...parsedData };

    await this.db.client.transaction(async (tx) => {
      for (const row of parsedData.validRows) {
        const foundCourse = await tx.query.course.findFirst({
          where: or(eq(course.title, row.title), eq(course.code, row.code)),
        });
        if (foundCourse) {
          result.courses.push({ ...row, isCreated: false });
          continue;
        }

        const foundLecturer = await this.db.client.query.lecturer.findFirst({
          where: eq(lecturer.email, row.lecturerEmail),
        });
        if (!foundLecturer) {
          result.courses.push({ ...row, isCreated: false });
          continue;
        }

        await tx
          .insert(course)
          .values({ ...row, lecturerId: foundLecturer.id });
        result.courses.push({ ...row, isCreated: true });
      }
    });

    return result;
  }

  async getCourses() {
    return await this.db.client.query.course.findMany();
  }

  async updateCourse(
    courseId: string,
    {
      code,
      title,
      lecturerEmail,
      description,
      semester,
      units,
    }: UpsertCourseBody,
  ) {
    const foundCourse = await this.db.client.query.course.findFirst({
      where: eq(course.id, courseId),
    });
    if (!foundCourse)
      throw new BadRequestException('Course with name or title not found');

    const foundLecturer = await this.db.client.query.lecturer.findFirst({
      where: eq(lecturer.email, lecturerEmail),
    });
    if (!foundLecturer) throw new BadRequestException('Lecturer not found');

    const [updatedCourse] = await this.db.client
      .update(course)
      .set({
        code,
        title,
        lecturerId: foundLecturer.id,
        description,
        semester,
        units,
      })
      .returning();
    return updatedCourse;
  }

  async deleteCourse(courseId: string) {
    const foundCourse = await this.db.client.query.course.findFirst({
      where: eq(course.id, courseId),
    });
    if (!foundCourse) throw new NotFoundException('Course not found');

    const [deletedCourse] = await this.db.client
      .delete(course)
      .where(eq(course.id, courseId))
      .returning();
    return deletedCourse;
  }
}
