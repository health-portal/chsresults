import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import {
  RegisterStudentBody,
  EditScoreBody,
  BatchStudentRegistrationResult,
} from './lecturers.schema';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { parseCsv } from 'src/lib/csv';

@Injectable()
export class LecturerService {
  constructor(private readonly prisma: PrismaService) {}

  private async validatorLecturerCourseAccess(
    lecturerId: string,
    courseId: string,
  ) {
    const foundCourseLecturer = await this.prisma.courseLecturer.findUnique({
      where: { isCoordinator: true, courseLecturer: { courseId, lecturerId } },
    });

    if (!foundCourseLecturer)
      throw new ForbiddenException("You don't access to this course");
  }

  async listCourses(lecturerId: string) {
    return await this.prisma.course.findMany({
      where: { lecturers: { some: { id: lecturerId } } },
    });
  }

  async registerStudent(
    lecturerId: string,
    courseId: string,
    { matricNumber }: RegisterStudentBody,
  ) {
    await this.validatorLecturerCourseAccess(lecturerId, courseId);
    try {
      await this.prisma.enrollment.create({
        data: { courseId, studentId: 'STUDENT_ID' },
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
    courseId: string,
    file: Express.Multer.File,
  ) {
    await this.validatorLecturerCourseAccess(lecturerId, courseId);
    const content = file.buffer.toString('utf-8');
    const parsedData = await parseCsv(content, RegisterStudentBody);
    const result: BatchStudentRegistrationResult = {
      ...parsedData,
      registeredStudents: [],
      unregisteredStudents: [],
    };

    return result;
  }

  async uploadScores(
    lecturerId: string,
    courseId: string,
    file: Express.Multer.File,
  ) {}

  async editScore(
    lecturerId: string,
    courseId: string,
    studentId: string,
    body: EditScoreBody,
  ) {}

  async viewCourseScores(lecturerId: string, courseId: string) {}

  async listCourseStudents(lecturerId: string, courseId: string) {}

  async getProfile(lecturerId: string) {}
}
