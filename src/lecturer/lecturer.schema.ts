import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsObject, IsString } from 'class-validator';
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

  @IsNumber()
  @IsNotEmpty()
  total: number;
}

export class EditResultBody extends Scores {}

export class RegisterStudentRow {
  @IsString()
  @IsNotEmpty()
  matricNumber: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UploadResultRow extends Scores {
  @IsString()
  @IsNotEmpty()
  matricNumber: string;
}

export class StudentResult {
  @IsString()
  @IsNotEmpty()
  matricNumber: string;

  @IsObject()
  scores: Scores;
}
