import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AssignDepartmentAndLevelBody,
  AssignLecturersBody,
  CreateSessionBody,
} from './sessions.schema';

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}

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
    body: AssignDepartmentAndLevelBody[],
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
      orderBy: { endDate: 'desc' },
    });

    return foundSessions.map((session) => {
      return {
        id: session.id,
        academicYear: session.academicYear,
        startDate: session.startDate,
        endDate: session.endDate,

        courses: session.courseSessions.map((courseSession) => ({
          title: courseSession.course.title,
          semester: courseSession.course.semester,
          department: courseSession.course.department.name,
          deptsAndLevels: courseSession.deptsAndLevels.map((deptAndLevel) => ({
            department: deptAndLevel.department.shortName,
            level: deptAndLevel.level,
          })),
        })),
      };
    });
  }

  async getCurrentSession() {
    const foundSession = await this.prisma.session.findFirst({
      orderBy: { endDate: 'desc' },
      where: {
        AND: { endDate: { gte: new Date() }, startDate: { lte: new Date() } },
      },
    });
    if (!foundSession) throw new NotFoundException('Current session not found');
    return foundSession;
  }
}
