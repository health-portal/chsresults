import { Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import {
  UpsertFacultyAndDepartmentBody,
  CreateDepartmentBody,
} from './college.schema';
import { DatabaseService } from 'src/database/database.service';
import { department, faculty } from 'drizzle/schema';

@Injectable()
export class CollegeService {
  constructor(private readonly db: DatabaseService) {}

  async getDepartments() {
    return await this.db.client.query.faculty.findMany({
      with: { departments: true },
    });
  }

  async createFaculty(body: UpsertFacultyAndDepartmentBody) {
    const [insertedFaculty] = await this.db.client
      .insert(faculty)
      .values(body)
      .returning();

    return insertedFaculty;
  }

  async updateFaculty(facultyId: string, body: UpsertFacultyAndDepartmentBody) {
    const [updatedFaculty] = await this.db.client
      .update(faculty)
      .set(body)
      .where(eq(faculty.id, facultyId))
      .returning();

    if (!updatedFaculty) throw new NotFoundException('Faculty not found');
    return updatedFaculty;
  }

  async deleteFaculty(facultyId: string) {
    const [deletedFaculty] = await this.db.client
      .delete(faculty)
      .where(eq(faculty.id, facultyId))
      .returning();

    if (!deletedFaculty) throw new NotFoundException('Faculty not found');
    return deletedFaculty;
  }

  async createDepartment({ facultyId, name }: CreateDepartmentBody) {
    const [insertedDept] = await this.db.client
      .insert(department)
      .values({ facultyId, name })
      .returning();
    return insertedDept;
  }

  async updateDepartment(deptId: string, body: UpsertFacultyAndDepartmentBody) {
    const [updatedDept] = await this.db.client
      .update(department)
      .set(body)
      .where(eq(department.id, deptId))
      .returning();

    if (!updatedDept) throw new NotFoundException('Department not found');
    return updatedDept;
  }

  async deleteDepartment(deptId: string) {
    const [deletedDept] = await this.db.client
      .delete(department)
      .where(eq(department.id, deptId))
      .returning();

    if (!deletedDept) throw new NotFoundException('Department not found');
    return deletedDept;
  }
}
