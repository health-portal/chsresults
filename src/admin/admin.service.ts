import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddAdminBody, UpdateAdminBody } from './admin.schema';
import { UserRole } from 'prisma/client/database';
import { TokensService } from 'src/tokens/tokens.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokensService: TokensService,
  ) {}

  async addAdmin({ email, name }: AddAdminBody) {
    const createdUser = await this.prisma.user.create({
      data: {
        email,
        role: UserRole.ADMIN,
        admin: { create: { name } },
      },
    });

    const url = await this.tokensService.genActivateAccountUrl({
      email: createdUser.email,
      role: UserRole.ADMIN,
      sub: createdUser.id,
    });

    return { message: 'Admin added successfully', url };
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
