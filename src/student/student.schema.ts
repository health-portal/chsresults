import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
import { student } from 'drizzle/schema';
import { DepartmentResponse } from 'src/college/college.schema';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

type Student = Omit<typeof student.$inferSelect, 'password'>;

export class StudentProfileResponse implements Student {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  email: string;

  @ApiProperty()
  matricNumber: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({ nullable: true })
  otherName: string | null;

  @ApiProperty()
  level: number;

  @ApiProperty({ enum: Gender })
  gender: string;

  @ApiProperty()
  degree: string;

  @ApiProperty()
  departmentId: string;

  @ApiProperty({ type: DepartmentResponse, required: false })
  department?: DepartmentResponse;
}

export class ChangePasswordBody {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty()
  @IsString()
  @IsStrongPassword()
  newPassword: string;
}

export class StudentEnrollmentResponse {}
