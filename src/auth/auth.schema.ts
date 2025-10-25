import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { LecturerRole, UserRole, Level } from '@prisma/client';

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
  userRole: UserRole;
  userData: UserData;
}

export class SetPasswordBody {
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  @IsNotEmpty()
  tokenString: string;
}

export class SigninUserBody {
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @IsStrongPassword()
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}

export class RequestPasswordResetBody {
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @IsEnum(UserRole)
  role: UserRole;
}

export class ChangePasswordBody {
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @IsStrongPassword()
  newPassword: string;
}
