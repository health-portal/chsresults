import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { admin } from 'drizzle/schema';
import { DatabaseService } from 'src/database/database.service';
import { AddAdminBody, UpdateAdminBody } from './admin.schema';

@Injectable()
export class AdminService {
  constructor(private readonly db: DatabaseService) {}

  async addAdmin({ email, name }: AddAdminBody) {
    const foundAdmin = await this.db.client.query.admin.findFirst({
      where: eq(admin.email, email),
    });
    if (foundAdmin) throw new BadRequestException('Admin already exists');

    const [insertedAdmin] = await this.db.client
      .insert(admin)
      .values({ email, name })
      .returning();

    const { password: _, ...adminProfile } = insertedAdmin;
    return adminProfile;
  }

  async getProfile(adminId: string) {
    const foundAdmin = await this.db.client.query.admin.findFirst({
      where: eq(admin.id, adminId),
    });
    if (!foundAdmin) throw new UnauthorizedException('Admin not found');

    const { password: _, ...adminProfile } = foundAdmin;
    return adminProfile;
  }

  async updateProfile(adminId: string, { name, phone }: UpdateAdminBody) {
    const foundAdmin = await this.db.client.query.admin.findFirst({
      where: eq(admin.id, adminId),
    });
    if (!foundAdmin) throw new BadRequestException('Admin not found');

    const [updatedAdmin] = await this.db.client
      .update(admin)
      .set({ name, phone })
      .returning();

    const { password: _, ...adminProfile } = updatedAdmin;
    return adminProfile;
  }
}
