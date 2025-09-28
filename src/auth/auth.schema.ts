import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsStrongPassword,
  IsEnum,
} from 'class-validator';

export enum UserRole {
  ADMIN = 'Admin',
  LECTURER = 'Lecturer',
  STUDENT = 'Student',
}

export interface JwtPayload {
  id: string;
  role: UserRole;
}

export class AuthUserBody {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsStrongPassword()
  password: string;
}

export enum StudentIdentifierType {
  EMAIL = 'email',
  MATRIC_NUMBER = 'matricNumber',
}

export class StudentIdentifierBody {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  studentIdentifier: string;

  @ApiProperty({ enum: StudentIdentifierType })
  @IsEnum(StudentIdentifierType)
  identifierType: StudentIdentifierType;
}

export class AuthStudentBody extends StudentIdentifierBody {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SigninResponse {
  @ApiProperty()
  accessToken: string;
}
