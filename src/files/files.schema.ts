import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';

export class UploadFileBody {
  @ApiProperty()
  @IsString()
  filename: string;

  @ApiProperty()
  @IsObject()
  content: object;
}
