import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from '@prisma/client';

export interface JwtPayload {
  id: string;
  role: UserRole;
  permissions?: string[];
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

  @IsString()
  @IsNotEmpty()
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
