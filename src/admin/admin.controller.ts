import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Role, RoleGuard } from 'src/auth/role.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserRole } from 'src/auth/auth.schema';
import { User } from 'src/auth/user.decorator';
import { AddAdminBody } from './admin.schema';

@Controller('admin')
@Role(UserRole.ADMIN)
@UseGuards(JwtAuthGuard, RoleGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  async addAdmin(@Body() body: AddAdminBody) {
    return await this.adminService.addAdmin(body);
  }

  @Get('profile')
  async getProfile(@User('id') adminId: string) {
    return await this.adminService.getProfile(adminId);
  }

  @Patch()
  async updateProfile(
    @User('id') adminId: string,
    @Query('name') name: string,
  ) {
    return await this.adminService.updateProfile(adminId, name);
  }
}
