import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AssignDeptAndLevelBody,
  AssignLecturersBody,
  CreateSessionBody,
} from './sessions.schema';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async createSession({ academicYear, startDate, endDate }: CreateSessionBody) {
    const foundSession = await this.prisma.session.findFirst({
      where: {
        AND: { startDate: { lte: startDate }, endDate: { gte: endDate } },
        academicYear,
      },
    });
    if (foundSession) throw new ConflictException('Session already exists');

    return await this.prisma.session.create({
      data: { academicYear, startDate, endDate },
    });
  }

  async getSessions() {
    const foundSessions = await this.prisma.session.findMany({
      orderBy: { endDate: 'desc' },
      select: {
        id: true,
        academicYear: true,
        startDate: true,
        endDate: true,
      },
    });

    return foundSessions;
  }

  async getSession(sessionId: string) {
    try {
      const foundSession = await this.prisma.session.findUniqueOrThrow({
        where: { id: sessionId },
        select: {
          id: true,
          academicYear: true,
          startDate: true,
          endDate: true,
          courseSessions: {
            select: {
              course: {
                select: {
                  title: true,
                  semester: true,
                  department: { select: { name: true } },
                },
              },
              deptsAndLevels: {
                select: {
                  department: { select: { shortName: true } },
                  level: true,
                },
              },
            },
          },
        },
      });

      return {
        id: foundSession.id,
        academicYear: foundSession.academicYear,
        startDate: foundSession.startDate,
        endDate: foundSession.endDate,
        courses: foundSession.courseSessions.map((courseSession) => ({
          title: courseSession.course.title,
          semester: courseSession.course.semester,
          department: courseSession.course.department.name,
          deptsAndLevels: courseSession.deptsAndLevels.map((deptAndLevel) => ({
            department: deptAndLevel.department.shortName,
            level: deptAndLevel.level,
          })),
        })),
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Session not found');
        }
      }

      throw new BadRequestException(error);
    }
  }

  async assignLecturersToCourse(
    sessionId: string,
    courseId: string,
    body: AssignLecturersBody,
  ) {
    if (!body.lecturerIds.includes(body.coordinatorId)) {
      throw new BadRequestException('Coordinator not included in lecturers');
    }

    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.courseLecturer.deleteMany({
          where: { courseSession: { courseId, sessionId } },
        });
        await tx.courseSession.update({
          where: { uniqueCourseSession: { courseId, sessionId } },
          data: {
            lecturers: {
              createMany: {
                data: body.lecturerIds.map((id) => {
                  const isCoordinator = id === body.coordinatorId;
                  return { lecturerId: id, isCoordinator };
                }),
              },
            },
          },
        });
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async assignDeptsAndLevelsToCourse(
    sessionId: string,
    courseId: string,
    body: AssignDeptAndLevelBody[],
  ) {
    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.courseSesnDeptAndLevel.deleteMany({
          where: { courseSession: { courseId, sessionId } },
        });
        await tx.courseSession.update({
          where: { uniqueCourseSession: { courseId, sessionId } },
          data: {
            deptsAndLevels: {
              createMany: {
                data: body.map(({ departmentId, level }) => ({
                  departmentId,
                  level,
                })),
              },
            },
          },
        });
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
