import { ApiProperty } from '@nestjs/swagger';
import { FileCategory } from 'prisma/client/database';

export class CreateFileBody {
  @ApiProperty()
  filename: string;

  @ApiProperty()
  mimetype: string;

  @ApiProperty()
  size: number;

  @ApiProperty()
  path: string;

  @ApiProperty({ enum: FileCategory })
  category: FileCategory;
}
