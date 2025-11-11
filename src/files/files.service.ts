import { Injectable } from '@nestjs/common';
import { ResultType, UserRole } from 'prisma/client/database';
import { CreateCourseBody, CreateCoursesRes } from 'src/courses/courses.schema';
import {
  CreateLecturerBody,
  CreateLecturersRes,
  RegisterStudentBody,
  RegisterStudentsRes,
  UploadResultRow,
  UploadResultsRes,
} from 'src/lecturers/lecturers.schema';
import { parseCsv } from 'src/lib/csv';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateStudentBody,
  CreateStudentsRes,
} from 'src/students/students.schema';

@Injectable()
export class FilesService {
  constructor(private readonly prisma: PrismaService) {}

  async createCourses(file: Express.Multer.File) {
    const content = file.buffer.toString('utf-8');
    const parsedData = await parseCsv(content, CreateCourseBody);
    const result: CreateCoursesRes = { courses: [], ...parsedData };

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
      } catch {
        result.courses.push({ ...row, isCreated: false });
      }
    }

    return result;
  }

  async createLecturers(file: Express.Multer.File) {
    const content = file.buffer.toString('utf-8');
    const parsedData = await parseCsv(content, CreateLecturerBody);
    const result: CreateLecturersRes = { lecturers: [], ...parsedData };

    for (const row of parsedData.validRows) {
      try {
        await this.prisma.user.create({
          data: {
            email: row.email,
            role: UserRole.LECTURER,
            lecturer: {
              create: {
                firstName: row.firstName,
                lastName: row.lastName,
                otherName: row.otherName,
                department: { connect: { name: row.department } },
                phone: row.phone,
                title: row.title,
              },
            },
          },
        });

        result.lecturers.push({ ...row, isCreated: true });
      } catch {
        result.lecturers.push({ ...row, isCreated: false });
      }
    }

    return result;
  }

  async createStudents(file: Express.Multer.File) {
    const content = file.buffer.toString('utf-8');
    const parsedData = await parseCsv(content, CreateStudentBody);
    const result: CreateStudentsRes = { students: [], ...parsedData };

    for (const row of parsedData.validRows) {
      try {
        await this.prisma.user.create({
          data: {
            email: row.email,
            role: UserRole.STUDENT,
            student: {
              create: {
                firstName: row.firstName,
                lastName: row.lastName,
                otherName: row.otherName,
                matricNumber: row.matricNumber,
                department: { connect: { name: row.department } },
                admissionYear: row.admissionYear,
                degree: row.degree,
                gender: row.gender,
                level: row.level,
              },
            },
          },
        });

        result.students.push({ ...row, isCreated: true });
      } catch {
        result.students.push({ ...row, isCreated: false });
      }
    }

    return result;
  }

  async registerStudents(
    lecturerId: string,
    courseSessionId: string,
    file: Express.Multer.File,
  ) {
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
}
