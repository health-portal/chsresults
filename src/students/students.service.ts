import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateStudentBody, CreateStudentsResult } from './students.schema';
import { department, student } from 'drizzle/schema';
import { eq, or } from 'drizzle-orm';
import { parseCsvFile } from 'src/utils/csv';

@Injectable()
export class StudentsService {
  constructor(private readonly db: DatabaseService) {}

  async createStudent(body: CreateStudentBody) {
    const existingStudent = await this.db.client.query.student.findFirst({
      where: or(
        eq(student.matricNumber, body.matricNumber),
        eq(student.email, body.email),
      ),
    });
    if (existingStudent)
      throw new BadRequestException('Student already registered');

    const departmentRecord = await this.db.client.query.department.findFirst({
      where: eq(department.name, body.department),
    });

    if (!departmentRecord)
      throw new BadRequestException('Department not found');

    const studentRecord = await this.db.client
      .insert(student)
      .values({ ...body, departmentId: departmentRecord.id })
      .returning();

    return studentRecord;
  }

  async createStudents(file: Express.Multer.File) {
    const parsedData = await parseCsvFile(file, CreateStudentBody);
    const result: CreateStudentsResult = { students: [], ...parsedData };

    await this.db.client.transaction(async (tx) => {
      for (const row of parsedData.validRows) {
        const departmentRecord = await tx.query.department.findFirst({
          where: eq(department.name, row.department),
        });
        if (!departmentRecord)
          result.students.push({ ...row, isCreated: false });
        else {
          await tx
            .insert(student)
            .values({ ...row, departmentId: departmentRecord.id });
          result.students.push({ ...row, isCreated: true });
        }
      }
    });

    return result;
  }

  async getStudents() {
    return await this.db.client.query.student.findMany();
  }
}
