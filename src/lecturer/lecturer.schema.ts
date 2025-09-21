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

export class EditResultBody {
  @ApiProperty()
  @IsNumber()
  continuousAssessment: number;

  @ApiProperty()
  @IsNumber()
  examination: number;

  @ApiProperty()
  @IsNumber()
  total: number;
}
