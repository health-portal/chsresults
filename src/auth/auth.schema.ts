import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum UserRole {
  STAFF = 'staff',
  STUDENT = 'student',
}

export interface JwtPayload {
  id: string;
  role: UserRole;
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
