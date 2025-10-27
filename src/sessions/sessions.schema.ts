import { ApiProperty } from '@nestjs/swagger';
import { Level, Semester } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsUUID } from 'class-validator';
import { IsSequentialAcademicYear } from 'src/college/college.schema';

export class CreateSessionBody {
  @ApiProperty()
  @IsSequentialAcademicYear()
  academicYear: string;

  @ApiProperty({ type: 'string', format: 'date-time' })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ type: 'string', format: 'date-time' })
  @IsDate()
  @Type(() => Date)
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

class DeptAndLevel {
  @ApiProperty()
  department: string;

  @ApiProperty({ enum: Level })
  level: Level;
}

class Course {
  @ApiProperty()
  title: string;

  @ApiProperty({ enum: Semester })
  semester: Semester;

  @ApiProperty()
  department: string;

  @ApiProperty({ type: [DeptAndLevel] })
  deptsAndLevels: DeptAndLevel[];
}

export class SessionResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  academicYear: string;

  @ApiProperty({ type: 'string', format: 'date-time' })
  startDate: Date;

  @ApiProperty({ type: 'string', format: 'date-time' })
  endDate: Date;

  @ApiProperty({ type: [Course] })
  courses: Course[];
}
