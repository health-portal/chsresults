import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { course, enrollment, student } from 'drizzle/schema';
import { DatabaseService } from 'src/database/database.service';
import { EditResultBody, RegisterStudentBody } from './lecturer.schema';

@Injectable()
export class LecturerService {
  constructor(private readonly db: DatabaseService) {}

  async listCourses(lecturerId: string) {
    const courses = await this.db.client.query.course.findMany({
      where: eq(course.lecturerId, lecturerId),
    });

    return courses;
  }

  async registerStudentsBulk(
    lecturerId: string,
    courseId: string,
    file: Express.Multer.File,
  ) {
    const courseRecord = await this.db.client.query.course.findFirst({
      where: and(eq(course.id, courseId), eq(course.lecturerId, lecturerId)),
    });

    if (!courseRecord) {
      throw new ForbiddenException(
        'You are not authorized to manage this course',
      );
    }

    const registrationResults = {
      successful: 0,
      failed: 0,
      errors: [],
    };

    return registrationResults;
  }

  async registerStudent(
    lecturerId: string,
    courseId: string,
    { studentIdentifier, identifierType }: RegisterStudentBody,
  ) {
    const courseRecord = await this.db.client.query.course.findFirst({
      where: and(eq(course.id, courseId), eq(course.lecturerId, lecturerId)),
    });

    if (!courseRecord) {
      throw new ForbiddenException(
        'You are not authorized to manage this course',
      );
    }

    const whereCondition =
      identifierType === 'email'
        ? eq(student.email, studentIdentifier)
        : eq(student.matricNumber, studentIdentifier);

    const studentRecord = await this.db.client.query.student.findFirst({
      where: whereCondition,
    });

    if (!studentRecord) {
      throw new NotFoundException(
        `Student not found with ${identifierType}: ${studentIdentifier}`,
      );
    }

    const existingEnrollment = await this.db.client.query.enrollment.findFirst({
      where: and(
        eq(enrollment.courseId, courseId),
        eq(enrollment.studentId, studentRecord.id),
      ),
    });

    if (existingEnrollment) {
      throw new ConflictException('Student is already enrolled in this course');
    }

    const [newEnrollment] = await this.db.client
      .insert(enrollment)
      .values({
        courseId,
        studentId: studentRecord.id,
      })
      .returning();

    return {
      enrollment: newEnrollment,
      student: studentRecord,
      course: courseRecord,
    };
  }

  async uploadResults(
    lecturerId: string,
    courseId: string,
    file: Express.Multer.File,
  ) {
    const courseRecord = await this.db.client.query.course.findFirst({
      where: and(eq(course.id, courseId), eq(course.lecturerId, lecturerId)),
    });

    if (!courseRecord) {
      throw new ForbiddenException(
        'You are not authorized to manage this course',
      );
    }

    const uploadResults = {
      totalProcessed: 0,
      successful: 0,
      failed: 0,
      errors: [],
    };

    return uploadResults;
  }

  async editResult(
    lecturerId: string,
    courseId: string,
    studentId: string,
    body: EditResultBody,
  ) {
    const courseRecord = await this.db.client.query.course.findFirst({
      where: and(eq(course.id, courseId), eq(course.lecturerId, lecturerId)),
    });

    if (!courseRecord) {
      throw new ForbiddenException(
        'You are not authorized to manage this course',
      );
    }

    const enrollmentRecord = await this.db.client.query.enrollment.findFirst({
      where: and(
        eq(enrollment.courseId, courseId),
        eq(enrollment.studentId, studentId),
      ),
    });

    if (!enrollmentRecord) {
      throw new NotFoundException('Student not found in this course');
    }

    const [updatedEnrollment] = await this.db.client
      .update(enrollment)
      .set({ result: body })
      .returning();

    return updatedEnrollment;
  }

  async viewCourseResults(lecturerId: string, courseId: string) {
    const courseRecord = await this.db.client.query.course.findFirst({
      where: and(eq(course.id, courseId), eq(course.lecturerId, lecturerId)),
    });

    if (!courseRecord) {
      throw new ForbiddenException(
        'You are not authorized to view this course',
      );
    }

    const courseResults = await this.db.client.query.enrollment.findMany({
      where: eq(enrollment.courseId, courseId),
    });

    return courseResults;
  }

  async listCourseStudents(lecturerId: string, courseId: string) {
    const courseRecord = await this.db.client.query.course.findFirst({
      where: and(eq(course.id, courseId), eq(course.lecturerId, lecturerId)),
    });

    if (!courseRecord) {
      throw new ForbiddenException(
        'You are not authorized to view this course',
      );
    }

    const courseStudents = await this.db.client.query.enrollment.findMany({
      where: eq(enrollment.courseId, courseId),
    });

    return courseStudents;
  }
}
