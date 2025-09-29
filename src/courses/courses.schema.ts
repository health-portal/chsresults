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
import { ParseCsvData } from 'src/utils/csv';

export class UpsertCourseBody {
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

export class CreateCourseResponse extends UpsertCourseBody {
  @ApiProperty()
  isCreated: boolean;
}

export class CreateCoursesResponse extends ParseCsvData<UpsertCourseBody> {
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
}
