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

export enum TokenType {
  ACTIVATE_ACCOUNT = 'activate_account',
  RESET_PASSWORD = 'reset_password',
}

export interface JwtPayload {
  id: string;
  role: UserRole;
}

export class VerifyUserBody {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsStrongPassword()
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  tokenString: string;
}

export class SigninUserBody {
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

export class SigninStudentBody extends StudentIdentifierBody {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class VerifyStudentBody extends SigninStudentBody {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  tokenString: string;
}

export class SigninResponse {
  @ApiProperty()
  accessToken: string;
}
