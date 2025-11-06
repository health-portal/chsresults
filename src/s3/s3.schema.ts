import { ApiProperty } from '@nestjs/swagger';

export class FileUrlsRes {
  @ApiProperty()
  uploadUrl: string;

  @ApiProperty()
  downloadUrl: string;
}
