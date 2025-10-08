import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import {
  course,
  department,
  enrollment,
  faculty,
  student,
} from 'drizzle/schema';
import { DatabaseService } from 'src/database/database.service';
import { ChangePasswordBody } from './student.schema';
import * as bcrypt from 'bcrypt';
import { env } from 'src/environment';

@Injectable()
export class StudentService {
  constructor(private readonly db: DatabaseService) {}

  async changePassword(
    studentId: string,
    { currentPassword, newPassword }: ChangePasswordBody,
  ) {
    const foundStudent = await this.db.client.query.student.findFirst({
      where: eq(student.id, studentId),
      with: { department: true },
    });
    if (!foundStudent) throw new UnauthorizedException('Student not found');

    if (foundStudent.password !== currentPassword)
      throw new BadRequestException('Current password incorrect');

    const hashedNewPassword = await bcrypt.hash(
      newPassword,
      Number(env.BCRYPT_SALT),
    );

    await this.db.client
      .update(student)
      .set({ password: hashedNewPassword })
      .returning();
    return { success: true, message: 'Password updated' };
  }

  async listEnrollments(studentId: string) {
    return await this.db.client
      .select({
        session: enrollment.session,
        course: {
          id: course.id,
          code: course.code,
          title: course.title,
          units: course.units,
          semester: course.semester,
        },
        department: {
          id: department.id,
          name: department.name,
        },
        faculty: {
          id: faculty.id,
          name: faculty.name,
        },
        enrollmentId: enrollment.id,
        scores: enrollment.scores,
      })
      .from(enrollment)
      .innerJoin(student, eq(enrollment.studentId, student.id))
      .innerJoin(course, eq(enrollment.courseId, course.id))
      .innerJoin(faculty, eq(department.facultyId, faculty.id))
      .where(eq(enrollment.studentId, studentId))
      .orderBy(enrollment.session);
  }

  async listEnrollment(studentId: string, enrollmentId: string) {
    const foundEnrollment = await this.db.client.query.enrollment.findFirst({
      where: and(
        eq(enrollment.studentId, studentId),
        eq(enrollment.id, enrollmentId),
      ),
    });
    if (!foundEnrollment) throw new NotFoundException('Enrollment not found');

    return foundEnrollment;
  }

  async getProfile(studentId: string) {
    const foundStudent = await this.db.client.query.student.findFirst({
      where: eq(student.id, studentId),
      with: { department: true },
    });
    if (!foundStudent) throw new UnauthorizedException('Student not found');

    const { password: _, ...studentProfile } = foundStudent;
    return studentProfile;
  }
}
