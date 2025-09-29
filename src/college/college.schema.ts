import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { faculty } from 'drizzle/schema';

export class UpsertFacultyAndDepartmentBody {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreateDepartmentBody extends UpsertFacultyAndDepartmentBody {
  @ApiProperty()
  @IsUUID()
  facultyId: string;
}

type Faculty = typeof faculty.$inferSelect;

export class FacultyResponse implements Faculty {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class DepartmentResponse extends FacultyResponse {
  @ApiProperty()
  facultyId: string;
}

export class GetDepartmentsResponse extends FacultyResponse {
  @ApiProperty({ type: [DepartmentResponse] })
  departments: DepartmentResponse[];
}
