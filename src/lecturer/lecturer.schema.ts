import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { type StudentIdentifierType } from 'src/auth/auth.schema';
import { ParseCsvData } from 'src/utils/csv';

export class RegisterStudentBody {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  studentIdentifier: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  identifierType: StudentIdentifierType;
}

export class Scores {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  continuousAssessment: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  examination: number;
}

export class EditScoreBody extends Scores {}

export class RegisterStudentRow {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  matricNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UploadScoreRow extends Scores {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  matricNumber: string;
}

export class BatchStudentRegistrationResponse extends ParseCsvData<RegisterStudentRow> {
  @ApiProperty()
  registeredStudents: string[];

  @ApiProperty()
  unregisteredStudents: string[];
}

export class UploadScoresResponse extends ParseCsvData<UploadScoreRow> {
  @ApiProperty()
  studentsUploadedFor: string[];

  @ApiProperty()
  studentsNotFound: string[];
}
