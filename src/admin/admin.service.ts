import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddAdminBody, UpdateAdminBody } from './admin.schema';
import { TokenType, UserRole } from 'prisma/client/database';
import { env } from 'src/lib/environment';
import { generateAccountActivationToken } from 'src/lib/tokens';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async addAdmin({ email, name }: AddAdminBody) {
    const createdUser = await this.prisma.user.create({
      data: {
        email,
        role: UserRole.ADMIN,
        admin: { create: { name } },
      },
    });

    const { tokenString, expiresAt } = generateAccountActivationToken();
    await this.prisma.tokenData.upsert({
      where: { userId: createdUser.id },
      update: {
        tokenString,
        tokenType: TokenType.ACCOUNT_ACTIVATION,
        expiresAt,
      },
      create: {
        tokenString,
        tokenType: TokenType.ACCOUNT_ACTIVATION,
        expiresAt,
        userId: createdUser.id,
      },
    });

    // TODO: Send account activation email
    const addAdminUrl = new URL(env.FRONTEND_BASE_URL + '/auth/activate');
    addAdminUrl.searchParams.set('email', email);
    addAdminUrl.searchParams.set('role', UserRole.ADMIN);
    addAdminUrl.searchParams.set('token', tokenString);
    console.log(addAdminUrl);
  }

  async getAdmins() {
    const foundAdmins = await this.prisma.admin.findMany({
      select: {
        id: true,
        name: true,
        phone: true,
        user: { select: { email: true, password: true } },
      },
    });

    return foundAdmins.map((admin) => ({
      id: admin.id,
      name: admin.name,
      phone: admin.phone,
      email: admin.user.email,
      isActivated: !!admin.user.password,
    }));
  }

  async getProfile(adminId: string) {
    const foundAdmin = await this.prisma.admin.findUniqueOrThrow({
      where: { userId: adminId },
      select: {
        id: true,
        name: true,
        phone: true,
        user: { select: { email: true } },
      },
    });

    return {
      id: foundAdmin.id,
      name: foundAdmin.name,
      phone: foundAdmin.phone,
      email: foundAdmin.user.email,
    };
  }

  async updateProfile(adminId: string, { name, phone }: UpdateAdminBody) {
    const foundAdmin = await this.prisma.admin.update({
      data: { name, phone },
      where: { userId: adminId },
      select: {
        id: true,
        name: true,
        phone: true,
        user: { select: { email: true } },
      },
    });

    return {
      id: foundAdmin.id,
      name: foundAdmin.name,
      phone: foundAdmin.phone,
      email: foundAdmin.user.email,
    };
  }
}
