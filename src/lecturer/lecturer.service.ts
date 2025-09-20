import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { course } from 'drizzle/schema';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class LecturerService {
  constructor(private readonly db: DatabaseService) {}

  async listCourses(lecturerId: string) {
    return await this.db.client.query.course.findMany({
      where: eq(course.lecturerId, lecturerId),
    });
  }

  async registerStudentsBulk(courseId: string, file: Express.Multer.File) {}

  async registerStudent(courseId: string, body: any) {}

  async updateStudent(courseId: string, studentId: string, body: any) {}

  async uploadScores(courseId: string, file: Express.Multer.File) {}

  async editScore(courseId: string, studentId: string, body: any) {}

  async viewCourseResults(courseId: string) {}

  async listCourseStudents(courseId: string) {}
}
