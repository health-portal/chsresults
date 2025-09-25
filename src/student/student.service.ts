import { Injectable } from '@nestjs/common';
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
    return await this.db.client.query.enrollment.findFirst({
      where: and(
        eq(enrollment.studentId, studentId),
        eq(enrollment.id, enrollmentId),
      ),
    });
  }

  async getProfile(studentId: string) {
    return await this.db.client.query.student.findFirst({
      where: eq(student.id, studentId),
    });
  }
}
