import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { User } from 'src/auth/user.decorator';
import { AddAdminBody, UpdateAdminBody } from './admin.schema';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  async addAdmin(@Body() body: AddAdminBody) {
    return await this.adminService.addAdmin(body);
  }

  @Get()
  async getAdmins() {
    return await this.adminService.getAdmins();
  }

  @Get('profile')
  async getProfile(@User('id') adminId: string) {
    return await this.adminService.getProfile(adminId);
  }

  @Patch('profile')
  async updateProfile(
    @User('id') adminId: string,
    @Body() body: UpdateAdminBody,
  ) {
    return await this.adminService.updateProfile(adminId, body);
  }
}
