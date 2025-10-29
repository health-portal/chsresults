import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ParseCsvData } from 'src/lib/csv';

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

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;
}

export class UpdateLecturerBody {
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

  @ApiProperty()
  @IsString()
  @IsOptional()
  title?: string;
}

export class CreateLecturerRes extends CreateLecturerBody {
  @ApiProperty()
  isCreated: boolean;
}

export class CreateLecturersRes extends ParseCsvData<CreateLecturerBody> {
  @ApiProperty({ type: [CreateLecturerRes] })
  lecturers: CreateLecturerRes[];
}

export class Scores {
  @ApiProperty()
  @IsNumber()
  @Transform(({ value }: { value: string }) => parseInt(value, 10), {
    toClassOnly: true,
  })
  continuousAssessment: number;

  @ApiProperty()
  @IsNumber()
  @Transform(({ value }: { value: string }) => parseInt(value, 10), {
    toClassOnly: true,
  })
  examination: number;
}

export class EditScoreBody extends Scores {}

export class RegisterStudentBody {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  matricNumber: string;
}

export class UploadScoreRow extends Scores {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  matricNumber: string;
}

export class BatchStudentRegistrationRes extends ParseCsvData<RegisterStudentBody> {
  @ApiProperty()
  registeredStudents: string[];

  @ApiProperty()
  unregisteredStudents: string[];
}

export class UploadScoresRes extends ParseCsvData<UploadScoreRow> {
  @ApiProperty()
  studentsUploadedFor: string[];

  @ApiProperty()
  studentsNotFound: string[];
}
