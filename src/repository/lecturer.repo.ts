import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateLecturerDto } from './schema';
import { lecturer } from 'drizzle/schema';

@Injectable()
export class LecturerRepository {
  constructor(private readonly db: DatabaseService) {}

  async createLecturer({
    firstName,
    lastName,
    email,
    otherName,
    phone,
    departmentId,
  }: CreateLecturerDto) {
    return await this.db.client.insert(lecturer).values({
      firstName,
      lastName,
      otherName,
      email,
      phone,
      departmentId,
    });
  }

  async batchCreateLecturer(lecturerList: Array<CreateLecturerDto>) {
    return await this.db.client
      .insert(lecturer)
      .values(lecturerList)
      .returning();
  }
}
