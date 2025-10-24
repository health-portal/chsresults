import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsNotEmpty,
  IsString,
  IsUUID,
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

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

function IsSequentialAcademicYear(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isSequentialAcademicYear',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: string, _args: ValidationArguments) {
          const match = /^(\d{4})\/(\d{4})$/.exec(value);
          if (!match) return false;

          const start = parseInt(match[1], 10);
          const end = parseInt(match[2], 10);
          return end === start + 1;
        },
        defaultMessage(_args: ValidationArguments) {
          return 'academicYear must be in the format YYYY/YYYY and consecutive (e.g., 2020/2021)';
        },
      },
    });
  };
}

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
