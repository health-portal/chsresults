import { OmitType, PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Gender } from 'src/student/student.schema';
import { ParseCsvData } from 'src/utils/csv';

export class CreateStudentBody {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  matricNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  otherName?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  department: string;

  @ApiProperty()
  @IsNumber()
  level: number;

  @ApiProperty({ enum: Gender })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  degree: string;
}

export class UpdateStudentBody extends OmitType(
  PartialType(CreateStudentBody),
  ['email', 'matricNumber'] as const,
) {}

export class CreateStudentResponse extends CreateStudentBody {
  @ApiProperty()
  isCreated: boolean;
}

export class CreateStudentsResponse extends ParseCsvData<CreateStudentBody> {
  @ApiProperty({ type: () => [CreateStudentResponse] })
  students: CreateStudentResponse[];
}
