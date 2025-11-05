import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileBody } from './files.schema';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthRoles } from 'src/auth/role.guard';
import { UserRole } from 'prisma/client/database';
import { type JwtPayload } from 'src/auth/auth.schema';
import { User } from 'src/auth/user.decorator';

@Controller('files')
@AuthRoles([UserRole.ADMIN, UserRole.LECTURER])
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  async createFile(@User() user: JwtPayload, @Body() body: CreateFileBody) {
    return await this.filesService.createFile(user.sub, body);
  }

  @Post('presigned-url')
  async generatePresignedUrl(fileId: string) {
    return await this.filesService.generatePresignedUrl(fileId);
  }
}
