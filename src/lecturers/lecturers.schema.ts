import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ParseCsvData } from 'src/utils/csv';

export class CreateLecturerBody {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  otherName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  department: string;
}

export class UpdateLecturerBody extends OmitType(
  PartialType(CreateLecturerBody),
  ['email'] as const,
) {}

export class CreateLecturerResult extends CreateLecturerBody {
  isCreated: boolean;
}

export class CreateLecturersResult extends ParseCsvData<CreateLecturerBody> {
  lecturers: CreateLecturerResult[];
}
