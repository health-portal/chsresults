import { ApiProperty } from '@nestjs/swagger';
import { Level } from '@prisma/client';
import { IsArray, IsDate, IsEnum, IsUUID } from 'class-validator';
import { IsSequentialAcademicYear } from 'src/college/college.schema';

export class CreateSessionBody {
  @ApiProperty()
  @IsSequentialAcademicYear()
  academicYear: string;

  @ApiProperty()
  @IsDate()
  startDate: Date;

  @ApiProperty()
  @IsDate()
  endDate: Date;
}

export class AssignLecturersBody {
  @ApiProperty()
  @IsArray()
  @IsUUID('4', { each: true })
  lecturerIds: string[];

  @ApiProperty()
  @IsUUID()
  coordinatorId: string;
}

export class AssignDepartmentAndLevelBody {
  @ApiProperty()
  @IsUUID('4')
  departmentId: string;

  @ApiProperty()
  @IsEnum(Level)
  level: Level;
}
