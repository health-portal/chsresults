import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateFacultyBody {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateFacultyBody {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreateDepartmentBody {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Faculty UUID' })
  @IsUUID()
  facultyId: string;
}

export class UpdateDepartmentBody {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
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
