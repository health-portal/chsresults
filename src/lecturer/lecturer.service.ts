import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  ConflictException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { course, enrollment, student } from 'drizzle/schema';
import { DatabaseService } from 'src/database/database.service';
import {
  EditResultBody,
  RegisterStudentBody,
  RegisterStudentRow,
  StudentResult,
  UploadResultRow,
} from './lecturer.schema';
import * as csv from 'fast-csv';
import { Readable } from 'stream';
import { plainToInstance } from 'class-transformer';

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

    const studentsToRegister: string[] = [];

    const stream = Readable.from(file.buffer);
    stream
      .pipe(csv.parse({ headers: true }))
      .on('error', (error) => {
        throw new UnprocessableEntityException(error);
      })
      .on('data', (row) => {
        const { matricNumber } = plainToInstance(RegisterStudentRow, row);
        if (matricNumber) {
          studentsToRegister.push(matricNumber);
        }
      });

    await this.db.client.transaction(async (tx) => {
      for (const studentMatricNumber of studentsToRegister) {
        const studentRecord = await tx.query.student.findFirst({
          where: eq(student.matricNumber, studentMatricNumber),
        });

        if (studentRecord) {
          await tx
            .insert(enrollment)
            .values({ courseId, studentId: studentRecord.id })
            .onConflictDoNothing({ target: enrollment.id });
        }
      }
    });
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

    return newEnrollment;
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

    const studentResults: StudentResult[] = [];

    const stream = Readable.from(file.buffer);
    stream
      .pipe(csv.parse({ headers: true }))
      .on('error', (error) => {
        throw new UnprocessableEntityException(error);
      })
      .on('data', (row) => {
        const { matricNumber, continuousAssessment, examination, total } =
          plainToInstance(UploadResultRow, row);
        if (matricNumber && continuousAssessment && examination && total) {
          studentResults.push({
            matricNumber,
            scores: { continuousAssessment, examination, total },
          });
        }
      });

    await this.db.client.transaction(async (tx) => {
      for (const { matricNumber, scores } of studentResults) {
        const studentRecord = await tx.query.student.findFirst({
          where: eq(student.matricNumber, matricNumber),
        });

        if (studentRecord) {
          await tx.update(enrollment).set({ scores });
        }
      }
    });
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
      .set({ scores: body })
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
