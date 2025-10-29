import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import {
  RegisterStudentBody,
  EditScoreBody,
  BatchStudentRegistrationRes,
  UploadScoreRow,
  UploadScoresRes,
} from './lecturers.schema';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { parseCsv } from 'src/lib/csv';

@Injectable()
export class LecturerService {
  constructor(private readonly prisma: PrismaService) {}

  private async validateCourseLecturerAccess(
    lecturerId: string,
    courseSessionId: string,
    isCoordinator: boolean = false,
  ) {
    const foundCourseLecturer = await this.prisma.courseLecturer.findUnique({
      where: {
        uniqueCourseSessionLecturer: { courseSessionId, lecturerId },
        isCoordinator: isCoordinator ? true : undefined,
      },
    });

    if (!foundCourseLecturer)
      throw new ForbiddenException("You don't access to this course");
  }

  async listCourses(lecturerId: string) {
    return await this.prisma.courseSession.findMany({
      where: { lecturers: { some: { id: lecturerId } } },
    });
  }

  async registerStudent(
    lecturerId: string,
    courseSessionId: string,
    { matricNumber }: RegisterStudentBody,
  ) {
    await this.validateCourseLecturerAccess(lecturerId, courseSessionId, true);
    try {
      await this.prisma.courseSession.update({
        where: { id: courseSessionId },
        data: {
          enrollments: { create: { student: { connect: { matricNumber } } } },
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Student already registered');
        }

        throw new BadRequestException(error);
      }
    }
  }

  async registerStudents(
    lecturerId: string,
    courseSessionId: string,
    file: Express.Multer.File,
  ) {
    await this.validateCourseLecturerAccess(lecturerId, courseSessionId, true);
    const content = file.buffer.toString('utf-8');
    const parsedData = await parseCsv(content, RegisterStudentBody);
    const result: BatchStudentRegistrationRes = {
      ...parsedData,
      registeredStudents: [],
      unregisteredStudents: [],
    };

    return result;
  }

  async uploadScores(
    lecturerId: string,
    courseSessionId: string,
    file: Express.Multer.File,
  ) {
    await this.validateCourseLecturerAccess(lecturerId, courseSessionId, true);
    const content = file.buffer.toString('utf-8');
    const parsedData = await parseCsv(content, UploadScoreRow);
    const result: UploadScoresRes = {
      ...parsedData,
      studentsUploadedFor: [],
      studentsNotFound: [],
    };

    for (const {
      matricNumber,
      continuousAssessment,
      examination,
    } of parsedData.validRows) {
      try {
        const foundStudent = await this.prisma.student.findUniqueOrThrow({
          where: { matricNumber },
        });
        await this.prisma.enrollment.update({
          where: {
            uniqueEnrollment: { courseSessionId, studentId: foundStudent.id },
          },
          data: { score: { continuousAssessment, examination } },
        });
        result.studentsUploadedFor.push(matricNumber);
      } catch {
        result.studentsNotFound.push(matricNumber);
      }
    }

    return result;
  }

  async editScore(
    lecturerId: string,
    courseSessionId: string,
    studentId: string,
    { continuousAssessment, examination }: EditScoreBody,
  ) {
    await this.validateCourseLecturerAccess(lecturerId, courseSessionId, true);
    await this.prisma.enrollment.update({
      where: { uniqueEnrollment: { courseSessionId, studentId } },
      data: { score: { continuousAssessment, examination } },
    });
  }

  async viewCourseScores(lecturerId: string, courseSessionId: string) {
    await this.validateCourseLecturerAccess(lecturerId, courseSessionId);
    return await this.prisma.enrollment.findMany({
      where: { courseSessionId },
    });
  }

  async listCourseStudents(lecturerId: string, courseSessionId: string) {
    await this.validateCourseLecturerAccess(lecturerId, courseSessionId);
    return await this.prisma.enrollment.findMany({
      where: { courseSessionId },
      select: { score: false },
    });
  }

  async getProfile(lecturerId: string) {
    const foundLecturer = await this.prisma.lecturer.findUnique({
      where: { id: lecturerId },
    });
    return foundLecturer;
  }
}
