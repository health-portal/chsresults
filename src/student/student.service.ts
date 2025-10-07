import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { enrollment, student } from 'drizzle/schema';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class StudentService {
  constructor(private readonly db: DatabaseService) {}

  async listEnrollments(studentId: string) {
    return await this.db.client.query.enrollment.findMany({
      where: eq(enrollment.studentId, studentId),
    });
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
