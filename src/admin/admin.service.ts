import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtPayload } from 'src/auth/auth.schema';
import { AddAdminBody, UpdateAdminBody } from './admin.schema';
import { UserRole } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private async generateAccessToken(payload: JwtPayload) {
    const token = await this.jwtService.signAsync(payload, { expiresIn: '1d' });
    return token;
  }

  async addAdmin({ email, name }: AddAdminBody) {
    const foundUser = await this.prisma.user.findUnique({ where: { email } });
    if (foundUser) throw new ConflictException('User already exists');

    await this.prisma.user.create({
      data: {
        email,
        role: UserRole.ADMIN,
        admin: { create: { name } },
      },
    });

    // TODO: Send account activation email
  }

  async getAdmins() {
    return await this.prisma.admin.findMany({
      include: { user: true },
    });
  }

  async getProfile(adminId: string) {
    return await this.prisma.admin.findUnique({
      where: { userId: adminId },
      include: { user: true },
    });
  }

  async updateProfile(adminId: string, { name, phone }: UpdateAdminBody) {
    return await this.prisma.admin.update({
      data: { name, phone },
      where: { userId: adminId },
    });
  }
}
