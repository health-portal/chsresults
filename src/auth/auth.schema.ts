import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { StaffRole, UserRole } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  userId: string;
  userRole: UserRole;
  staffRole?: StaffRole;
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
  token: string;
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
