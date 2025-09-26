import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import {
  CreateLecturerBody,
  CreateLecturersResponse,
  UpdateLecturerBody,
} from './lecturers.schema';
import { department, lecturer } from 'drizzle/schema';
import { eq } from 'drizzle-orm';
import { parseCsvFile } from 'src/utils/csv';

@Injectable()
export class LecturersService {
  constructor(private readonly db: DatabaseService) {}

  async createLecturer(body: CreateLecturerBody) {
    const foundLecturer = await this.db.client.query.lecturer.findFirst({
      where: eq(lecturer.email, body.email),
    });
    if (foundLecturer)
      throw new BadRequestException('Lecturer already registered');

    const foundDepartment = await this.db.client.query.department.findFirst({
      where: eq(department.name, body.department),
    });
    if (!foundDepartment) throw new BadRequestException('Department not found');

    const [insertedLecturer] = await this.db.client
      .insert(lecturer)
      .values({ ...body, departmentId: foundDepartment.id })
      .returning();

    const { password: _, ...lecturerProfile } = insertedLecturer;
    return lecturerProfile;
  }

  async createLecturers(file: Express.Multer.File) {
    const parsedData = await parseCsvFile(file, CreateLecturerBody);
    const result: CreateLecturersResponse = { lecturers: [], ...parsedData };

    await this.db.client.transaction(async (tx) => {
      for (const row of parsedData.validRows) {
        const foundDepartment = await tx.query.department.findFirst({
          where: eq(department.name, row.department),
        });
        if (!foundDepartment)
          result.lecturers.push({ ...row, isCreated: false });
        else {
          await tx
            .insert(lecturer)
            .values({ ...row, departmentId: foundDepartment.id });
          result.lecturers.push({ ...row, isCreated: true });
        }
      }
    });

    return result;
  }

  async getLecturers() {
    const foundLecturers = await this.db.client.query.lecturer.findMany();
    return foundLecturers.map((l) => {
      const { password: _, ...lecturerProfile } = l;
      return lecturerProfile;
    });
  }

  async updateLecturer(lecturerId: string, body: UpdateLecturerBody) {
    const foundLecturer = await this.db.client.query.lecturer.findFirst({
      where: eq(lecturer.id, lecturerId),
    });
    if (!foundLecturer) throw new BadRequestException('Lecturer not found');

    const [updatedLecturer] = await this.db.client
      .update(lecturer)
      .set(body)
      .where(eq(lecturer.id, lecturerId))
      .returning();
    const { password: _, ...lecturerProfile } = updatedLecturer;
    return lecturerProfile;
  }

  async deleteLecturer(lecturerId: string) {
    const [foundLecturer] = await this.db.client
      .delete(lecturer)
      .where(eq(lecturer.id, lecturerId))
      .returning();
    if (!foundLecturer) throw new NotFoundException('Lecturer not found');

    const { password: _, ...lecturerProfile } = foundLecturer;
    return lecturerProfile;
  }
}
