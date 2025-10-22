import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum StaffRole {
  ADMIN = 'admin',
  DEAN = 'dean',
  HOD = 'hod',
  LECTURER = 'lecturer',
  PART_ADVISER = 'part_adviser',
}

export enum StaffPermission {}

export const StaffRolePermission = {
  [StaffRole.ADMIN]: [],
};

export class CreateStaffBody {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  qualification: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  department: string;

  @IsEnum(StaffRole)
  role: StaffRole;
}
