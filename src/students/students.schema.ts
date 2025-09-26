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

export class CreateStudentResponse extends CreateStudentBody {
  @ApiProperty()
  isCreated: boolean;
}

export class CreateStudentsResponse extends ParseCsvData<CreateStudentBody> {
  @ApiProperty({ type: CreateStudentResponse, isArray: true })
  students: CreateStudentResponse[];
}

export class UpdateStudentBody extends OmitType(
  PartialType(CreateStudentBody),
  ['email', 'matricNumber'] as const,
) {}
