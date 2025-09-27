import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { department, faculty } from 'drizzle/schema';

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

type FacultyType = typeof faculty.$inferSelect;
export class FacultyResponse implements FacultyType {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}

type DepartmentType = typeof department.$inferSelect;
export class DepartmentResponse implements DepartmentType {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsUUID()
  facultyId: string;
}

export class GetDepartmentsResponse extends FacultyResponse {
  @ApiProperty({ isArray: true })
  departments: DepartmentResponse[];
}
