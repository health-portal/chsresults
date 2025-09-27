import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
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
  @ApiProperty({ type: () => [CreateCourseResponse] })
  courses: CreateCourseResponse[];
}

export class CourseResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  lecturerId: string;
}

export class EnrollmentResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  scores: Scores;

  @ApiProperty()
  courseId: string;

  @ApiProperty()
  studentId: string;
}
