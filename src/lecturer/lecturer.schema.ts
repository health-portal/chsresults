import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { lecturer } from 'drizzle/schema';
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

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  session: string;
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

export class RegisterStudentRow {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  matricNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  session: string;
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

type Lecturer = Omit<typeof lecturer.$inferSelect, 'password'>;

export class LecturerProfileResponse implements Lecturer {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({ nullable: true })
  otherName: string | null;

  @ApiProperty({ nullable: true })
  phone: string | null;

  @ApiProperty()
  title: string;

  @ApiProperty()
  departmentId: string;
}
