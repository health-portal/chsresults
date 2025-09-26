import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import {
  CreateStudentBody,
  CreateStudentsResponse,
  UpdateStudentBody,
} from './students.schema';
import { department, student } from 'drizzle/schema';
import { eq, or } from 'drizzle-orm';
import { parseCsvFile } from 'src/utils/csv';

@Injectable()
export class StudentsService {
  constructor(private readonly db: DatabaseService) {}

  async createStudent(body: CreateStudentBody) {
    const foundStudent = await this.db.client.query.student.findFirst({
      where: or(
        eq(student.matricNumber, body.matricNumber),
        eq(student.email, body.email),
      ),
    });
    if (foundStudent)
      throw new BadRequestException('Student already registered');

    const foundDepartment = await this.db.client.query.department.findFirst({
      where: eq(department.name, body.department),
    });
    if (!foundDepartment) throw new BadRequestException('Department not found');

    const [insertedStudent] = await this.db.client
      .insert(student)
      .values({ ...body, departmentId: foundDepartment.id })
      .returning();

    const { password: _, ...studentProfile } = insertedStudent;
    return studentProfile;
  }

  async createStudents(file: Express.Multer.File) {
    const parsedData = await parseCsvFile(file, CreateStudentBody);
    const result: CreateStudentsResponse = { students: [], ...parsedData };

    await this.db.client.transaction(async (tx) => {
      for (const row of parsedData.validRows) {
        const foundDepartment = await tx.query.department.findFirst({
          where: eq(department.name, row.department),
        });
        if (!foundDepartment)
          result.students.push({ ...row, isCreated: false });
        else {
          await tx
            .insert(student)
            .values({ ...row, departmentId: foundDepartment.id });
          result.students.push({ ...row, isCreated: true });
        }
      }
    });

    return result;
  }

  async getStudents() {
    const foundStudents = await this.db.client.query.student.findMany();
    return foundStudents.map((s) => {
      const { password: _, ...studentProfile } = s;
      return studentProfile;
    });
  }

  async updateStudent(studentId: string, body: UpdateStudentBody) {
    const foundStudent = await this.db.client.query.student.findFirst({
      where: eq(student.id, studentId),
    });
    if (!foundStudent) throw new NotFoundException('Student not found');

    let departmentId: string | undefined = foundStudent.departmentId;
    if (body.department) {
      const foundDepartment = await this.db.client.query.department.findFirst({
        where: eq(department.name, body.department),
      });
      if (!foundDepartment)
        throw new BadRequestException('Department not found');
      departmentId = foundDepartment.id;
    }

    const [updatedStudent] = await this.db.client
      .update(student)
      .set({ ...body, departmentId })
      .where(eq(student.id, studentId))
      .returning();

    const { password: _, ...studentProfile } = updatedStudent;
    return studentProfile;
  }

  async deleteStudent(studentId: string) {
    const foundStudent = await this.db.client.query.student.findFirst({
      where: eq(student.id, studentId),
    });
    if (!foundStudent) throw new NotFoundException('Student not found');

    const [deleteStudent] = await this.db.client
      .delete(student)
      .where(eq(student.id, studentId))
      .returning();

    const { password: _, ...studentProfile } = deleteStudent;
    return studentProfile;
  }
}
