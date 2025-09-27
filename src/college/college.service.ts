import { Injectable, NotFoundException } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from 'drizzle/schema';
import { eq } from 'drizzle-orm';
import { Pool } from 'pg';
import { env } from 'src/environment';
import {
  CreateFacultyBody,
  UpdateFacultyBody,
  CreateDepartmentBody,
  UpdateDepartmentBody,
} from './college.schema';

const pool = new Pool({ connectionString: env.DATABASE_URL });
const db = drizzle(pool, { schema });

@Injectable()
export class CollegeService {
  async getDepartments() {
    return db.query.faculty.findMany({
      with: { departments: true },
    });
  }

  async createFaculty(body: CreateFacultyBody) {
    const [faculty] = await db.insert(schema.faculty).values(body).returning();
    return faculty;
  }

  async updateFaculty(facultyId: string, body: UpdateFacultyBody) {
    const [faculty] = await db
      .update(schema.faculty)
      .set(body)
      .where(eq(schema.faculty.id, facultyId))
      .returning();

    if (!faculty) throw new NotFoundException('Faculty not found');
    return faculty;
  }

  async deleteFaculty(facultyId: string) {
    const [faculty] = await db
      .delete(schema.faculty)
      .where(eq(schema.faculty.id, facultyId))
      .returning();

    if (!faculty) throw new NotFoundException('Faculty not found');
    return faculty;
  }

  async createDepartment({ facultyId, name }: CreateDepartmentBody) {
    const [dept] = await db
      .insert(schema.department)
      .values({ facultyId, name })
      .returning();
    return dept;
  }

  async updateDepartment(deptId: string, body: UpdateDepartmentBody) {
    const [dept] = await db
      .update(schema.department)
      .set(body)
      .where(eq(schema.department.id, deptId))
      .returning();

    if (!dept) throw new NotFoundException('Department not found');
    return dept;
  }

  async deleteDepartment(deptId: string) {
    const [dept] = await db
      .delete(schema.department)
      .where(eq(schema.department.id, deptId))
      .returning();

    if (!dept) throw new NotFoundException('Department not found');
    return dept;
  }
}
