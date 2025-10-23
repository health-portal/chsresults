import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

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
