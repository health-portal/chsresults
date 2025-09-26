import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UpsertCourseBody, CreateCoursesResult } from './courses.schema';
import { eq, or } from 'drizzle-orm';
import { course, lecturer } from 'drizzle/schema';
import { parseCsvFile } from 'src/utils/csv';

@Injectable()
export class CoursesService {
  constructor(private readonly db: DatabaseService) {}

  async createCourse({ code, title, lecturerEmail }: UpsertCourseBody) {
    const existingCourse = await this.db.client.query.course.findFirst({
      where: or(eq(course.title, title), eq(course.code, code)),
    });
    if (existingCourse)
      throw new BadRequestException(
        'Course with name or title already registered',
      );

    const existingLecturer = await this.db.client.query.lecturer.findFirst({
      where: eq(lecturer.email, lecturerEmail),
    });
    if (!existingLecturer) throw new BadRequestException('Lecturer not found');

    const courseRecord = await this.db.client
      .insert(course)
      .values({ code, title, lecturerId: existingLecturer.id });
    return courseRecord;
  }

  async createCourses(file: Express.Multer.File) {
    const parsedData = await parseCsvFile(file, UpsertCourseBody);
    const result: CreateCoursesResult = { courses: [], ...parsedData };

    await this.db.client.transaction(async (tx) => {
      for (const row of parsedData.validRows) {
        const existingCourse = await tx.query.course.findFirst({
          where: or(eq(course.title, row.title), eq(course.code, row.code)),
        });
        if (existingCourse) {
          result.courses.push({ ...row, isCreated: false });
          continue;
        }

        const existingLecturer = await this.db.client.query.lecturer.findFirst({
          where: eq(lecturer.email, row.lecturerEmail),
        });
        if (!existingLecturer) {
          result.courses.push({ ...row, isCreated: false });
          continue;
        }

        await tx
          .insert(course)
          .values({ ...row, lecturerId: existingLecturer.id });
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
    { code, title, lecturerEmail }: UpsertCourseBody,
  ) {
    const existingCourse = await this.db.client.query.course.findFirst({
      where: eq(course.id, courseId),
    });
    if (!existingCourse)
      throw new BadRequestException('Course with name or title not found');

    const existingLecturer = await this.db.client.query.lecturer.findFirst({
      where: eq(lecturer.email, lecturerEmail),
    });
    if (!existingLecturer) throw new BadRequestException('Lecturer not found');

    const courseRecord = await this.db.client
      .update(course)
      .set({ code, title, lecturerId: existingLecturer.id })
      .returning();
    return courseRecord;
  }

  async deleteCourse(courseId: string) {
    const existingCourse = await this.db.client.query.course.findFirst({
      where: eq(course.id, courseId),
    });
    if (!existingCourse) throw new NotFoundException('Course not found');

    return await this.db.client
      .delete(course)
      .where(eq(course.id, courseId))
      .returning();
  }
}
