import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsStrongPassword,
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

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
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

export class AdminProfileResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;
}

export class LecturerProfileResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  otherName?: string;

  @ApiProperty()
  phone?: string;

  @ApiProperty()
  departmentId: string;
}

export class StudentProfileResponse {
  @ApiProperty()
  email: string;

  @ApiProperty()
  matricNumber: string;

  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  otherName?: string;

  @ApiProperty()
  departmentId: string;
}
