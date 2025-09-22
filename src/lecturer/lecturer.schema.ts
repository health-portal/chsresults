import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { type StudentIdentifierType } from 'src/auth/auth.schema';

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
  @IsNumber()
  @IsNotEmpty()
  continuousAssessment: number;

  @IsNumber()
  @IsNotEmpty()
  examination: number;
}

export class EditScoreBody extends Scores {}

export class RegisterStudentRow {
  @IsString()
  @IsNotEmpty()
  matricNumber: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UploadScoreRow extends Scores {
  @IsString()
  @IsNotEmpty()
  matricNumber: string;
}

export class RowValidationError {
  row: number;
  errorMessage: string;
}

export class ParseCsvData<T extends object> {
  numberOfRows: number;
  validRows: T[];
  invalidRows: RowValidationError[];
}

export class BulkStudentRegistrationResult extends ParseCsvData<RegisterStudentRow> {
  registeredStudents: string[];
  unregisteredStudents: string[];
}

export class UploadScoresResult extends ParseCsvData<UploadScoreRow> {
  studentsUploadedFor: string[];
  studentsNotFound: string[];
}
