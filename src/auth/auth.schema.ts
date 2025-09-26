import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsStrongPassword,
} from 'class-validator';
import { admin, lecturer, student } from 'drizzle/schema';

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

export class AdminProfileResponse
  implements Omit<typeof admin.$inferSelect, 'password'>
{
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;
}

export class LecturerProfileResponse
  implements Omit<typeof lecturer.$inferSelect, 'password'>
{
  @ApiProperty()
  id: string;

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
  departmentId: string;
}

export class StudentProfileResponse
  implements Omit<typeof student.$inferSelect, 'password'>
{
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

  @ApiProperty({ nullable: true })
  otherName: string | null;

  @ApiProperty()
  departmentId: string;
}
