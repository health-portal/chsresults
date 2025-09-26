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
import { AdminProfileResponse, UserRole } from 'src/auth/auth.schema';
import { User } from 'src/auth/user.decorator';
import { AddAdminBody } from './admin.schema';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Admin')
@ApiBearerAuth('accessToken')
@Controller('admin')
@Role(UserRole.ADMIN)
@UseGuards(JwtAuthGuard, RoleGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @ApiOperation({ summary: 'Add a new admin user' })
  @ApiBody({ type: AddAdminBody })
  @ApiCreatedResponse({ description: 'Admin successfully added' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async addAdmin(@Body() body: AddAdminBody) {
    return await this.adminService.addAdmin(body);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get admin profile' })
  @ApiOkResponse({
    description: 'Profile retrieved successfully',
    type: AdminProfileResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async getProfile(@User('id') adminId: string) {
    return await this.adminService.getProfile(adminId);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update admin profile' })
  @ApiQuery({ name: 'name', type: String, required: true })
  @ApiOkResponse({
    description: 'Profile updated successfully',
    type: AdminProfileResponse,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async updateProfile(
    @User('id') adminId: string,
    @Query('name') name: string,
  ) {
    return await this.adminService.updateProfile(adminId, name);
  }
}
