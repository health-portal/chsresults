import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateStudentDto } from './schema';
import { student } from 'drizzle/schema';

@Injectable()
export class StudentRepository {
  constructor(private readonly db: DatabaseService) {}

  async createStudent({
    email,
    matricNumber,
    firstName,
    lastName,
    otherName,
    departmentId,
  }: CreateStudentDto) {
    return await this.db.client
      .insert(student)
      .values({
        email,
        matricNumber,
        firstName,
        lastName,
        otherName,
        departmentId,
      })
      .returning();
  }

  async batchCreateStudent(studentList: Array<CreateStudentDto>) {
    return await this.db.client.insert(student).values(studentList).returning();
  }
}
