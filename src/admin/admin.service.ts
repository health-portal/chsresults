import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { course, lecturer } from 'drizzle/schema';
import { NotFoundException } from '@nestjs/common';
import { CourseBody } from './admin.schema';
import { DatabaseService } from 'src/database/database.service';
import { LecturerRepository } from 'src/repository/lecturer.repo';
import { StudentRepository } from 'src/repository/student.repo';
import { JobService } from 'src/jobs/jobs.service';
import { CreateStudentDto, CreateLecturerDto } from 'src/repository/schema';

@Injectable()
export class AdminService {
  constructor(
    private readonly db: DatabaseService,
    private readonly lecturerRepo: LecturerRepository,
    private readonly studentRepo: StudentRepository,
    private readonly jobService: JobService,
  ) {}

  async createCourse({ code, title, lecturerId }: CourseBody) {
    const fetchedLecturer = await this.db.client.query.lecturer.findFirst({
      where: eq(lecturer.id, lecturerId),
    });
    if (!fetchedLecturer) throw new NotFoundException('Lecturer not found!');
    return await this.db.client.insert(course).values({
      code,
      title,
      lecturerId,
    });
  }

  async createLecturers(lecturerData: CreateLecturerDto) {
    return await this.lecturerRepo.createLecturer(lecturerData);
  }

  async createLecturersBatch(file: any, createdBy: string) {
    return await this.jobService.createLecturers(file, createdBy);
  }

  async createStudents(studentData: CreateStudentDto) {
    return await this.studentRepo.createStudent(studentData);
  }

  async createStudentsBatch(file: any, createdBy: string) {
    return await this.jobService.createStudents(file, createdBy);
  }
}
