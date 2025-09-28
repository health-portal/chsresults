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

  @ApiProperty({ required: true })
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

export class UpdateStudentBody {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  otherName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  department?: string;

  @ApiProperty()
  @IsNumber()
  level: number;

  @ApiProperty({ enum: Gender, required: false })
  @IsEnum(Gender)
  gender?: Gender;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  degree?: string;
}

export class CreateStudentResponse extends CreateStudentBody {
  @ApiProperty()
  isCreated: boolean;
}

export class CreateStudentsResponse extends ParseCsvData<CreateStudentBody> {
  @ApiProperty({ type: [CreateStudentResponse] })
  students: CreateStudentResponse[];
}
