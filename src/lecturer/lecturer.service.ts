import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { course, enrollment, lecturer, student } from 'drizzle/schema';
import { DatabaseService } from 'src/database/database.service';
import {
  BatchStudentRegistrationResponse,
  EditScoreBody,
  RegisterStudentBody,
  RegisterStudentRow,
  UploadScoreRow,
  UploadScoresResponse,
} from './lecturer.schema';
import { StudentIdentifierType } from 'src/auth/auth.schema';
import { parseCsvFile } from 'src/utils/csv';
import { EmailQueueService } from 'src/email-queue/email-queue.service';
import { NotificationTemplate } from 'src/email-queue/email-queue.schema';
import { env } from 'src/environment';

@Injectable()
export class LecturerService {
  constructor(
    private readonly db: DatabaseService,
    private readonly emailQueueService: EmailQueueService,
  ) {}

  private async validateCourseAccess(lecturerId: string, courseId: string) {
    const foundCourse = await this.db.client.query.course.findFirst({
      where: and(eq(course.id, courseId), eq(course.lecturerId, lecturerId)),
    });

    if (!foundCourse) {
      throw new ForbiddenException(
        'You are not authorized to access this course',
      );
    }
  }

  async listCourses(lecturerId: string) {
    return await this.db.client.query.course.findMany({
      where: eq(course.lecturerId, lecturerId),
    });
  }

  async registerStudentsBatch(
    lecturerId: string,
    courseId: string,
    file: Express.Multer.File,
  ) {
    await this.validateCourseAccess(lecturerId, courseId);

    const parsedData = await parseCsvFile(file, RegisterStudentRow);
    const result: BatchStudentRegistrationResponse = {
      registeredStudents: [],
      unregisteredStudents: [],
      ...parsedData,
    };

    await this.db.client.transaction(async (tx) => {
      for (const { matricNumber, session } of parsedData.validRows) {
        const foundStudent = await tx.query.student.findFirst({
          where: eq(student.matricNumber, matricNumber),
        });

        if (foundStudent) {
          const [insertedEnrollment] = await tx
            .insert(enrollment)
            .values({ courseId, studentId: foundStudent.id, session })
            .returning()
            .onConflictDoNothing();

          if (insertedEnrollment) {
            await this.emailQueueService.createTask({
              subject: 'Notification of Enrollment',
              toEmail: foundStudent.email,
              htmlContent: NotificationTemplate({
                title: `Notification of Enrollment`,
                name: `${foundStudent.firstName} ${foundStudent.lastName}`,
                message: `You have been enrolled to ${courseId}`,
                portalLink: `${env.FRONTEND_BASE_URL}/student/signin`,
              }),
            });

            result.registeredStudents.push(matricNumber);
          } else result.unregisteredStudents.push(matricNumber);
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
    { studentIdentifier, identifierType, session }: RegisterStudentBody,
  ) {
    await this.validateCourseAccess(lecturerId, courseId);

    const whereCondition =
      identifierType === StudentIdentifierType.EMAIL
        ? eq(student.email, studentIdentifier)
        : eq(student.matricNumber, studentIdentifier);

    const foundStudent = await this.db.client.query.student.findFirst({
      where: whereCondition,
    });

    if (!foundStudent) {
      throw new NotFoundException(
        `Student not found with ${identifierType}: ${studentIdentifier}`,
      );
    }

    const foundEnrollment = await this.db.client.query.enrollment.findFirst({
      where: and(
        eq(enrollment.courseId, courseId),
        eq(enrollment.studentId, foundStudent.id),
      ),
    });

    if (foundEnrollment) {
      throw new ConflictException('Student is already enrolled in this course');
    }

    const [insertedEnrollment] = await this.db.client
      .insert(enrollment)
      .values({
        courseId,
        studentId: foundStudent.id,
        session,
      })
      .returning();

    await this.emailQueueService.createTask({
      subject: 'Notification of Enrollment',
      toEmail: foundStudent.email,
      htmlContent: NotificationTemplate({
        title: `Notification of Enrollment`,
        name: `${foundStudent.firstName} ${foundStudent.lastName}`,
        message: `You have been enrolled to ${courseId}`,
        portalLink: `${env.FRONTEND_BASE_URL}/student/signin`,
      }),
    });

    return insertedEnrollment;
  }

  async uploadScores(
    lecturerId: string,
    courseId: string,
    file: Express.Multer.File,
  ) {
    await this.validateCourseAccess(lecturerId, courseId);

    const parsedData = await parseCsvFile(file, UploadScoreRow);
    const result: UploadScoresResponse = {
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
        const foundStudent = await tx.query.student.findFirst({
          where: eq(student.matricNumber, matricNumber),
        });

        if (foundStudent) {
          await tx
            .update(enrollment)
            .set({ scores: { continuousAssessment, examination } })
            .where(eq(enrollment.studentId, foundStudent.id))
            .returning();

          await this.emailQueueService.createTask({
            subject: 'Notification for Uploaded Score',
            toEmail: foundStudent.email,
            htmlContent: NotificationTemplate({
              title: `Notification for Uploaded Score`,
              name: `${foundStudent.firstName} ${foundStudent.lastName}`,
              message: `Your score for ${courseId} has been uploaded`,
              portalLink: `${env.FRONTEND_BASE_URL}/student/signin`,
            }),
          });

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

    const foundEnrollment = await this.db.client.query.enrollment.findFirst({
      where: and(
        eq(enrollment.courseId, courseId),
        eq(enrollment.studentId, studentId),
      ),
    });

    if (!foundEnrollment) {
      throw new NotFoundException('Student not found in this course');
    }

    const [updatedEnrollment] = await this.db.client
      .update(enrollment)
      .set({ scores: body })
      .where(eq(enrollment.studentId, foundEnrollment.studentId))
      .returning();

    return updatedEnrollment;
  }

  async viewCourseScores(lecturerId: string, courseId: string) {
    const foundCourse = await this.db.client.query.course.findFirst({
      where: and(eq(course.id, courseId), eq(course.lecturerId, lecturerId)),
    });

    if (!foundCourse) {
      throw new ForbiddenException(
        'You are not authorized to view this course',
      );
    }

    const foundEnrollments = await this.db.client.query.enrollment.findMany({
      where: eq(enrollment.courseId, courseId),
      with: {
        student: {
          columns: { password: false },
          with: { department: { columns: { name: true } } },
        },
      },
    });

    return foundEnrollments;
  }

  async listCourseStudents(lecturerId: string, courseId: string) {
    await this.validateCourseAccess(lecturerId, courseId);

    const foundEnrollments = await this.db.client.query.enrollment.findMany({
      where: eq(enrollment.courseId, courseId),
      columns: { scores: false },
      with: {
        student: {
          columns: { password: false },
          with: { department: { columns: { name: true } } },
        },
      },
    });

    return foundEnrollments;
  }

  async getProfile(lecturerId: string) {
    const foundLecturer = await this.db.client.query.lecturer.findFirst({
      where: eq(lecturer.id, lecturerId),
      columns: { password: false },
    });
    if (!foundLecturer) throw new UnauthorizedException('Lecturer not found');

    return foundLecturer;
  }
}
