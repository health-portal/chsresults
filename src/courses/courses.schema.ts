import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
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
  @IsUUID()
  lecturerEmail: string;
}

export class CreateCourseResult extends CreateCourseBody {
  isCreated: boolean;
}

export class CreateCoursesResult extends ParseCsvData<CreateCourseBody> {
  courses: CreateCourseResult[];
}
