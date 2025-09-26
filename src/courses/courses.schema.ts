import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { course, enrollment } from 'drizzle/schema';
import { Scores } from 'src/lecturer/lecturer.schema';
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
  @IsUUID()
  lecturerEmail: string;
}

export class CreateCourseResponse extends UpsertCourseBody {
  @ApiProperty()
  isCreated: boolean;
}

export class CreateCoursesResponse extends ParseCsvData<UpsertCourseBody> {
  @ApiProperty({ type: CreateCourseResponse, isArray: true })
  courses: CreateCourseResponse[];
}

type CourseType = typeof course.$inferSelect;
export class CourseResponse implements CourseType {
  @ApiProperty()
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  lecturerId: string;
}

type EnrollmentType = typeof enrollment.$inferSelect;
export class EnrollmentResponse implements EnrollmentType {
  @ApiProperty()
  id: string;

  @ApiProperty()
  scores: Scores;

  @ApiProperty()
  courseId: string;

  @ApiProperty()
  studentId: string;
}
