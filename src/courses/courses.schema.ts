import { ApiProperty } from '@nestjs/swagger';
import { Semester } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ParseCsvData } from 'src/lib/csv';

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
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  department: string;

  @ApiProperty()
  @IsNumber()
  @Transform(({ value }: { value: string }) => parseInt(value, 10), {
    toClassOnly: true,
  })
  units: number;

  @ApiProperty()
  @IsEnum(Semester)
  semester: Semester;
}

export class UpdateCourseBody {
  @ApiProperty()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;
}

export class CreateCourseResult extends CreateCourseBody {
  @ApiProperty()
  isCreated: boolean;
}

export class CreateCoursesResult extends ParseCsvData<CreateCourseBody> {
  @ApiProperty({ type: [CreateCourseResult] })
  courses: CreateCourseResult[];
}
