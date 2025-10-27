import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { LecturerRole, UserRole, Level } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export type AdminData = {
  adminId: string;
};

export type LecturerData = {
  lecturerId: string;
  departmentId: string;
  facultyId: string;
  designations: { role: LecturerRole; entity: string }[];
};

export type StudentData = {
  studentId: string;
  departmentId: string;
  facultyId: string;
  matricNumber: string;
  level: Level;
};

export type UserData = AdminData | LecturerData | StudentData;

export interface JwtPayload {
  sub: string;
  email: string;
  userRole: UserRole;
  userData: UserData;
}

export class SetPasswordBody {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty()
  @IsStrongPassword()
  password: string;

  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  tokenString: string;
}

export class SigninUserBody {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;
}

export class RequestPasswordResetBody {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;
}

export class ChangePasswordBody {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty()
  @IsStrongPassword()
  newPassword: string;
}

export class SetPasswordResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole;
}

export class SigninUserResponse {
  @ApiProperty()
  accessToken: string;
}
