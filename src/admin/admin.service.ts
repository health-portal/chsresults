import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { admin } from 'drizzle/schema';
import { DatabaseService } from 'src/database/database.service';
import { AddAdminBody } from './admin.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(private readonly db: DatabaseService) {}

  async addAdmin({ email, name, password }: AddAdminBody) {
    const foundAdmin = await this.db.client.query.admin.findFirst({
      where: eq(admin.email, email),
    });
    if (foundAdmin) throw new BadRequestException('Admin already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const insertedAdmin = await this.db.client
      .insert(admin)
      .values({ email, name, password: hashedPassword })
      .returning();

    const { password: _, ...adminProfile } = insertedAdmin[0];
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

  async updateProfile(adminId: string, name: string) {
    const foundAdmin = await this.db.client.query.admin.findFirst({
      where: eq(admin.id, adminId),
    });
    if (!foundAdmin) throw new BadRequestException('Admin not found');

    const updatedAdmin = await this.db.client
      .update(admin)
      .set({ name })
      .returning();

    const { password, ...adminProfile } = updatedAdmin[0];
    return adminProfile;
  }
}
