import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { User } from 'src/auth/user.decorator';
import {
  AddAdminBody,
  AdminProfileResponse,
  UpdateAdminBody,
} from './admin.schema';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @ApiOperation({ summary: 'Invite an admin' })
  @ApiCreatedResponse({ description: 'Admin added successfully' })
  @ApiConflictResponse({ description: 'User already exists' })
  async addAdmin(@Body() body: AddAdminBody) {
    return await this.adminService.addAdmin(body);
  }

  @Get()
  @ApiOperation({ summary: 'Get list of admins' })
  @ApiOkResponse({ type: [AdminProfileResponse] })
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
