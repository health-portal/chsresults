import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { course, enrollment } from 'drizzle/schema';
import { DepartmentResponse } from 'src/college/college.schema';
import { LecturerProfileResponse } from 'src/lecturer/lecturer.schema';
import { StudentProfileResponse } from 'src/student/student.schema';
import { ParseCsvData } from 'src/utils/csv';

export class CreateCourseBody {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsEmail()
  lecturerEmail: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsNumber()
  @Transform(({ value }: { value: string }) => parseInt(value, 10), {
    toClassOnly: true,
  })
  units: number;

  @ApiProperty()
  @IsNumber()
  @Transform(({ value }: { value: string }) => parseInt(value, 10), {
    toClassOnly: true,
  })
  semester: number;
}

export class UpdateCourseBody {
  @ApiProperty()
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  lecturerEmail: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsNumber()
  @Transform(({ value }: { value: string }) => parseInt(value, 10), {
    toClassOnly: true,
  })
  @IsOptional()
  units?: number;

  @ApiProperty()
  @IsNumber()
  @Transform(({ value }: { value: string }) => parseInt(value, 10), {
    toClassOnly: true,
  })
  @IsOptional()
  semester: number;
}

export class CreateCourseResponse extends CreateCourseBody {
  @ApiProperty()
  isCreated: boolean;
}

export class CreateCoursesResponse extends ParseCsvData<CreateCourseBody> {
  @ApiProperty({ type: [CreateCourseResponse] })
  courses: CreateCourseResponse[];
}

type Course = typeof course.$inferSelect;

export class CourseResponse implements Course {
  @ApiProperty({ nullable: true })
  description: string | null;

  @ApiProperty()
  title: string;

  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  code: string;

  @ApiProperty()
  units: number;

  @ApiProperty()
  semester: number;

  @ApiProperty()
  lecturerId: string;

  @ApiProperty({ type: LecturerProfileResponse })
  lecturer: LecturerProfileResponse;
}

type Enrollment = typeof enrollment.$inferSelect;

export class EnrollmentResponse implements Enrollment {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  session: string;

  @ApiProperty()
  scores: unknown;

  @ApiProperty()
  courseId: string;

  @ApiProperty()
  studentId: string;

  @ApiProperty({ type: StudentProfileResponse })
  student: StudentProfileResponse;

  @ApiProperty({ type: DepartmentResponse })
  department: DepartmentResponse;
}
