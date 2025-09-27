import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UpsertFacultyAndDepartmentBody {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreateDepartmentBody extends UpsertFacultyAndDepartmentBody {
  @ApiProperty({ description: 'Faculty UUID' })
  @IsUUID()
  facultyId: string;
}

export class FacultyResponse {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class DepartmentResponse extends FacultyResponse {
  @ApiProperty()
  @IsUUID()
  facultyId: string;
}

export class GetDepartmentsResponse extends FacultyResponse {
  @ApiProperty({ type: () => [DepartmentResponse] })
  departments: DepartmentResponse[];
}
