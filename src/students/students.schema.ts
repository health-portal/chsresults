import { OmitType, PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
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
}

export class CreateStudentResult extends CreateStudentBody {
  isCreated: boolean;
}

export class CreateStudentsResult extends ParseCsvData<CreateStudentBody> {
  students: CreateStudentResult[];
}

export class UpdateStudentBody extends OmitType(
  PartialType(CreateStudentBody),
  ['email', 'matricNumber'] as const,
) {}
