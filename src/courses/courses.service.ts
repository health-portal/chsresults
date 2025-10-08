import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import {
  CreateCourseBody,
  UpdateCourseBody,
  CreateCoursesResponse,
} from './courses.schema';
import { eq, or } from 'drizzle-orm';
import { course, enrollment, lecturer } from 'drizzle/schema';
import { parseCsvFile } from 'src/utils/csv';
import { EmailQueueService } from 'src/email-queue/email-queue.service';
import { NotificationTemplate } from 'src/email-queue/email-queue.schema';
import { env } from 'src/environment';
import { count } from 'drizzle-orm';

@Injectable()
export class CoursesService {
  constructor(
    private readonly db: DatabaseService,
    private readonly emailQueueService: EmailQueueService,
  ) {}

  async createCourse({
    code,
    title,
    lecturerEmail,
    semester,
    units,
  }: CreateCourseBody) {
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

    await this.emailQueueService.send({
      subject: 'Notification to Manage Course',
      toEmail: foundLecturer.email,
      htmlContent: NotificationTemplate({
        name: `${foundLecturer.title} ${foundLecturer.firstName} ${foundLecturer.lastName}`,
        message: `You have been selected to manage this course: ${insertedCourse.code}`,
        portalLink: `${env.FRONTEND_BASE_URL}/auth`,
        title: `Notification to Manage Course`,
      }),
    });

    return insertedCourse;
  }

  async createCourses(file: Express.Multer.File) {
    const parsedData = await parseCsvFile(file, CreateCourseBody);
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

        const [insertedCourse] = await tx
          .insert(course)
          .values({ ...row, lecturerId: foundLecturer.id })
          .returning()
          .onConflictDoNothing();

        if (insertedCourse) {
          result.courses.push({ ...row, isCreated: true });

          await this.emailQueueService.send({
            subject: 'Notification to Manage Course',
            toEmail: foundLecturer.email,
            htmlContent: NotificationTemplate({
              name: `${foundLecturer.title} ${foundLecturer.firstName} ${foundLecturer.lastName}`,
              message: `You have been selected to manage this course: ${insertedCourse.code}`,
              portalLink: `${env.FRONTEND_BASE_URL}/auth`,
              title: `Notification to Manage Course`,
            }),
          });
        } else result.courses.push({ ...row, isCreated: false });
      }
    });

    return result;
  }

  async getCourses() {
    return await this.db.client
      .select({
        id: course.id,
        code: course.code,
        title: course.title,
        description: course.description,
        units: course.units,
        semester: course.semester,
        lecturer: {
          id: lecturer.id,
          firstName: lecturer.firstName,
          lastName: lecturer.lastName,
          email: lecturer.email,
        },
        enrollmentCount: count(enrollment.id),
      })
      .from(course)
      .leftJoin(enrollment, eq(enrollment.courseId, course.id))
      .leftJoin(lecturer, eq(lecturer.id, course.lecturerId))
      .groupBy(
        course.id,
        course.code,
        course.title,
        course.description,
        course.units,
        course.semester,
        course.lecturerId,
        lecturer.id,
        lecturer.firstName,
        lecturer.lastName,
        lecturer.email,
      );
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
    }: UpdateCourseBody,
  ) {
    const foundCourse = await this.db.client.query.course.findFirst({
      where: eq(course.id, courseId),
    });
    if (!foundCourse) throw new BadRequestException('Course not found');

    let lecturerId = foundCourse.lecturerId;
    if (lecturerEmail) {
      const foundLecturer = await this.db.client.query.lecturer.findFirst({
        where: eq(lecturer.email, lecturerEmail),
      });
      if (!foundLecturer) throw new NotFoundException('Lecturer not found');

      lecturerId = foundLecturer.id;
    }

    const [updatedCourse] = await this.db.client
      .update(course)
      .set({
        code,
        title,
        lecturerId,
        description,
        semester,
        units,
      })
      .where(eq(course.id, courseId))
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
