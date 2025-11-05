import { ForbiddenException, Injectable } from '@nestjs/common';
import {
  RegisterStudentBody,
  EditResultBody,
  RegisterStudentsRes,
  UploadResultRow,
  UploadResultsRes,
} from './lecturers.schema';
import { PrismaService } from 'src/prisma/prisma.service';
import { parseCsv } from 'src/lib/csv';
import { ResultType } from 'prisma/client/database';

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
      throw new ForbiddenException(
        'You are not authorized to register students in this course session.',
      );
  }

  async listCourseSessions(lecturerId: string) {
    const foundCourseSessions = await this.prisma.courseSession.findMany({
      where: { lecturers: { some: { id: lecturerId } } },
      select: {
        course: {
          select: {
            code: true,
            title: true,
            units: true,
            semester: true,
            description: true,
          },
        },
        session: { select: { academicYear: true } },
      },
    });

    return foundCourseSessions.map((courseSession) => ({
      ...courseSession.course,
      academicYear: courseSession.session.academicYear,
    }));
  }

  async registerStudent(
    lecturerId: string,
    courseSessionId: string,
    { matricNumber }: RegisterStudentBody,
  ) {
    await this.validateCourseLecturerAccess(lecturerId, courseSessionId, true);
    await this.prisma.courseSession.update({
      where: { id: courseSessionId },
      data: {
        enrollments: { create: { student: { connect: { matricNumber } } } },
      },
    });
  }

  async registerStudents(
    lecturerId: string,
    courseSessionId: string,
    file: Express.Multer.File,
  ) {
    await this.validateCourseLecturerAccess(lecturerId, courseSessionId, true);
    const content = file.buffer.toString('utf-8');
    const parsedData = await parseCsv(content, RegisterStudentBody);
    const result: RegisterStudentsRes = {
      ...parsedData,
      registeredStudents: [],
      unregisteredStudents: [],
    };

    for (const { matricNumber } of parsedData.validRows) {
      try {
        await this.prisma.courseSession.update({
          where: { id: courseSessionId },
          data: {
            enrollments: { create: { student: { connect: { matricNumber } } } },
          },
        });
        result.registeredStudents.push(matricNumber);
      } catch {
        result.unregisteredStudents.push(matricNumber);
      }
    }

    return result;
  }

  async uploadResults(
    lecturerId: string,
    courseSessionId: string,
    file: Express.Multer.File,
  ) {
    await this.validateCourseLecturerAccess(lecturerId, courseSessionId, true);
    const content = file.buffer.toString('utf-8');
    const parsedData = await parseCsv(content, UploadResultRow);
    const result: UploadResultsRes = {
      ...parsedData,
      studentsUploadedFor: [],
      studentsNotFound: [],
    };

    for (const { matricNumber, scores } of parsedData.validRows) {
      try {
        const foundStudent = await this.prisma.student.findUniqueOrThrow({
          where: { matricNumber },
        });
        await this.prisma.enrollment.update({
          where: {
            uniqueEnrollment: { courseSessionId, studentId: foundStudent.id },
          },
          data: { results: { create: { scores, type: ResultType.INITIAL } } },
        });
        result.studentsUploadedFor.push(matricNumber);
      } catch {
        result.studentsNotFound.push(matricNumber);
      }
    }

    return result;
  }

  async editResult(
    lecturerId: string,
    courseSessionId: string,
    studentId: string,
    { scores }: EditResultBody,
  ) {
    await this.validateCourseLecturerAccess(lecturerId, courseSessionId, true);
    await this.prisma.enrollment.update({
      where: { uniqueEnrollment: { courseSessionId, studentId } },
      data: { results: { create: { scores, type: ResultType.INITIAL } } },
    });
  }

  async viewCourseResults(lecturerId: string, courseSessionId: string) {
    await this.validateCourseLecturerAccess(lecturerId, courseSessionId);
    const foundEnrollments = await this.prisma.enrollment.findMany({
      where: { courseSessionId },
      select: {
        id: true,
        status: true,
        student: {
          select: {
            id: true,
            matricNumber: true,
            firstName: true,
            lastName: true,
            otherName: true,
            level: true,
            department: { select: { name: true } },
          },
        },
        results: { select: { type: true, scores: true } },
      },
    });

    return foundEnrollments.map((enrollment) => ({
      id: enrollment.id,
      status: enrollment.status,
      studentId: enrollment.student.id,
      studentName:
        `${enrollment.student.lastName} ${enrollment.student.firstName} ${enrollment.student.otherName}`.trim(),
      studentLevel: enrollment.student.level,
      studentDepartment: enrollment.student.department.name,
      results: enrollment.results.map((result) => ({
        scores: result.scores,
        type: result.type,
      })),
    }));
  }

  async listCourseStudents(lecturerId: string, courseSessionId: string) {
    await this.validateCourseLecturerAccess(lecturerId, courseSessionId);
    const foundEnrollments = await this.prisma.enrollment.findMany({
      where: { courseSessionId },
      select: {
        id: true,
        status: true,
        student: {
          select: {
            id: true,
            matricNumber: true,
            firstName: true,
            lastName: true,
            otherName: true,
            level: true,
            department: { select: { name: true } },
          },
        },
      },
    });

    return foundEnrollments.map((enrollment) => ({
      id: enrollment.id,
      status: enrollment.status,
      studentId: enrollment.student.id,
      studentName:
        `${enrollment.student.lastName} ${enrollment.student.firstName} ${enrollment.student.otherName}`.trim(),
      studentLevel: enrollment.student.level,
      studentDepartment: enrollment.student.department.name,
    }));
  }

  async getProfile(lecturerId: string) {
    const foundLecturer = await this.prisma.lecturer.findUniqueOrThrow({
      where: { id: lecturerId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        otherName: true,
        title: true,
        phone: true,
        qualification: true,
        department: { select: { name: true } },
        user: { select: { email: true } },
      },
    });

    return {
      id: foundLecturer.id,
      firstName: foundLecturer.firstName,
      lastName: foundLecturer.lastName,
      otherName: foundLecturer.otherName,
      phone: foundLecturer.phone,
      title: foundLecturer.title,
      qualification: foundLecturer.qualification,
      department: foundLecturer.department.name,
      email: foundLecturer.user.email,
    };
  }
}
