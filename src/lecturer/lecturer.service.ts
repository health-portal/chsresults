import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  ConflictException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { course, enrollment, lecturer, student } from 'drizzle/schema';
import { DatabaseService } from 'src/database/database.service';
import {
  BatchStudentRegistrationResult,
  EditScoreBody,
  ParseCsvData,
  RegisterStudentBody,
  RegisterStudentRow,
  RowValidationError,
  UploadScoreRow,
  UploadScoresResult,
} from './lecturer.schema';
import * as csv from 'fast-csv';
import { Readable } from 'stream';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

@Injectable()
export class LecturerService {
  constructor(private readonly db: DatabaseService) {}

  private async validateCourseAccess(lecturerId: string, courseId: string) {
    const courseRecord = await this.db.client.query.course.findFirst({
      where: and(eq(course.id, courseId), eq(course.lecturerId, lecturerId)),
    });

    if (!courseRecord) {
      throw new ForbiddenException(
        'You are not authorized to access this course',
      );
    }
  }

  private async parseCsvFile<T extends object>(
    file: Express.Multer.File,
    validationClass: new () => T,
  ): Promise<ParseCsvData<T>> {
    return new Promise((resolve, reject) => {
      const validRows: T[] = [];
      const invalidRows: RowValidationError[] = [];

      let currentRow = 0;

      const stream = Readable.from(file.buffer);
      stream
        .pipe(csv.parse({ headers: true }))
        .on('error', (error) => {
          reject(new UnprocessableEntityException(error.message));
        })
        .on('data', (row) => {
          currentRow++;
          const transformedRow = plainToInstance(validationClass, row);
          const validationErrors = validateSync(transformedRow);

          if (validationErrors.length > 0) {
            validationErrors.map((error) => {
              invalidRows.push({
                row: currentRow,
                errorMessage: error.toString(),
              });
            });
          } else {
            validRows.push(transformedRow);
          }
        })
        .on('end', () => {
          resolve({ validRows, invalidRows, numberOfRows: currentRow });
        });
    });
  }

  async listCourses(lecturerId: string) {
    const courses = await this.db.client.query.course.findMany({
      where: eq(course.lecturerId, lecturerId),
    });

    return courses;
  }

  async registerStudentsBatch(
    lecturerId: string,
    courseId: string,
    file: Express.Multer.File,
  ) {
    await this.validateCourseAccess(lecturerId, courseId);

    const parsedData = await this.parseCsvFile(file, RegisterStudentRow);
    const result: BatchStudentRegistrationResult = {
      registeredStudents: [],
      unregisteredStudents: [],
      ...parsedData,
    };

    await this.db.client.transaction(async (tx) => {
      for (const { matricNumber } of parsedData.validRows) {
        const studentRecord = await tx.query.student.findFirst({
          where: eq(student.matricNumber, matricNumber),
        });

        if (studentRecord) {
          await tx
            .insert(enrollment)
            .values({ courseId, studentId: studentRecord.id })
            .onConflictDoNothing();
          result.registeredStudents.push(matricNumber);
        } else {
          result.unregisteredStudents.push(matricNumber);
        }
      }
    });

    return result;
  }

  async registerStudent(
    lecturerId: string,
    courseId: string,
    { studentIdentifier, identifierType }: RegisterStudentBody,
  ) {
    await this.validateCourseAccess(lecturerId, courseId);

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

  async uploadScores(
    lecturerId: string,
    courseId: string,
    file: Express.Multer.File,
  ) {
    await this.validateCourseAccess(lecturerId, courseId);

    const parsedData = await this.parseCsvFile(file, UploadScoreRow);
    const result: UploadScoresResult = {
      studentsUploadedFor: [],
      studentsNotFound: [],
      ...parsedData,
    };

    await this.db.client.transaction(async (tx) => {
      for (const {
        matricNumber,
        continuousAssessment,
        examination,
      } of parsedData.validRows) {
        const studentRecord = await tx.query.student.findFirst({
          where: eq(student.matricNumber, matricNumber),
        });

        if (studentRecord) {
          await tx
            .update(enrollment)
            .set({ scores: { continuousAssessment, examination } });

          result.studentsUploadedFor.push(matricNumber);
        } else {
          result.studentsNotFound.push(matricNumber);
        }
      }
    });

    return result;
  }

  async editScore(
    lecturerId: string,
    courseId: string,
    studentId: string,
    body: EditScoreBody,
  ) {
    await this.validateCourseAccess(lecturerId, courseId);

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

  async viewCourseScores(lecturerId: string, courseId: string) {
    const courseRecord = await this.db.client.query.course.findFirst({
      where: and(eq(course.id, courseId), eq(course.lecturerId, lecturerId)),
    });

    if (!courseRecord) {
      throw new ForbiddenException(
        'You are not authorized to view this course',
      );
    }

    const courseScores = await this.db.client.query.enrollment.findMany({
      where: eq(enrollment.courseId, courseId),
    });

    return courseScores;
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

  async getProfile(lecturerId: string) {
    return await this.db.client.query.lecturer.findFirst({
      where: eq(lecturer.id, lecturerId),
    });
  }
}
