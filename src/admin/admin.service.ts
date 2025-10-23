import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtPayload } from 'src/auth/auth.schema';
import { AddAdminBody, UpdateAdminBody } from './admin.schema';
import { StaffRole, UserRole } from '@prisma/client';
import { TokensService } from 'src/tokens/tokens.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly tokensService: TokensService,
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
        fullName: name,
        role: UserRole.STAFF,
        staff: { create: { role: StaffRole.ADMIN } },
      },
    });

    // TODO: Send account activation email
  }

  async getAdmins() {
    return await this.prisma.staff.findMany({
      where: { role: StaffRole.ADMIN },
      include: { user: true },
    });
  }

  async getProfile(adminId: string) {
    return await this.prisma.staff.findUnique({
      where: { role: StaffRole.ADMIN, userId: adminId },
      include: { user: true },
    });
  }

  async updateProfile(adminId: string, { name, phone }: UpdateAdminBody) {
    return await this.prisma.staff.update({
      data: { phone, user: { update: { fullName: name } } },
      where: { role: StaffRole.ADMIN, userId: adminId },
    });
  }
}
