import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export type UserRole = 'admin' | 'lecturer' | 'student';

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
  @IsString()
  @IsNotEmpty()
  password: string;
}

export type StudentIdentifierType = 'email' | 'matricNumber';
export class AuthStudentBody {
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
  password: string;
}
