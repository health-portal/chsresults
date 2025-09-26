import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
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

export class CreateCourseResult extends UpsertCourseBody {
  isCreated: boolean;
}

export class CreateCoursesResult extends ParseCsvData<UpsertCourseBody> {
  courses: CreateCourseResult[];
}
