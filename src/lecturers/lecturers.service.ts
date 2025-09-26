import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import {
  CreateLecturerBody,
  CreateLecturersResult,
  UpdateLecturerBody,
} from './lecturers.schema';
import { department, lecturer } from 'drizzle/schema';
import { eq } from 'drizzle-orm';
import { parseCsvFile } from 'src/utils/csv';

@Injectable()
export class LecturersService {
  constructor(private readonly db: DatabaseService) {}

  async createLecturer(body: CreateLecturerBody) {
    const existingLecturer = await this.db.client.query.lecturer.findFirst({
      where: eq(lecturer.email, body.email),
    });
    if (existingLecturer)
      throw new BadRequestException('Lecturer already registered');

    const departmentRecord = await this.db.client.query.department.findFirst({
      where: eq(department.name, body.department),
    });

    if (!departmentRecord)
      throw new BadRequestException('Department not found');

    const lecturerRecord = await this.db.client
      .insert(lecturer)
      .values({ ...body, departmentId: departmentRecord.id })
      .returning();

    return lecturerRecord;
  }

  async createLecturers(file: Express.Multer.File) {
    const parsedData = await parseCsvFile(file, CreateLecturerBody);
    const result: CreateLecturersResult = { lecturers: [], ...parsedData };

    await this.db.client.transaction(async (tx) => {
      for (const row of parsedData.validRows) {
        const departmentRecord = await tx.query.department.findFirst({
          where: eq(department.name, row.department),
        });
        if (!departmentRecord)
          result.lecturers.push({ ...row, isCreated: false });
        else {
          await tx
            .insert(lecturer)
            .values({ ...row, departmentId: departmentRecord.id });
          result.lecturers.push({ ...row, isCreated: true });
        }
      }
    });

    return result;
  }

  async getLecturers() {
    return await this.db.client.query.lecturer.findMany();
  }

  async updateLecturer(lecturerId: string, body: UpdateLecturerBody) {
    const existingLecturer = await this.db.client.query.lecturer.findFirst({
      where: eq(lecturer.id, lecturerId),
    });
    if (!existingLecturer) throw new BadRequestException('Lecturer not found');

    const lecturerRecord = await this.db.client
      .update(lecturer)
      .set(body)
      .where(eq(lecturer.id, lecturerId))
      .returning();
    return lecturerRecord;
  }

  async deleteLecturer(lecturerId: string) {
    const lecturerRecord = await this.db.client
      .delete(lecturer)
      .where(eq(lecturer.id, lecturerId))
      .returning();
    return lecturerRecord;
  }
}
