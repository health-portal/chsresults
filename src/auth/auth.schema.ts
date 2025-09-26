import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsStrongPassword,
} from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  LECTURER = 'lecturer',
  STUDENT = 'student',
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
