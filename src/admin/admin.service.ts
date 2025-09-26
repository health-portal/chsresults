import { BadRequestException, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { admin } from 'drizzle/schema';
import { DatabaseService } from 'src/database/database.service';
import { AddAdminBody } from './admin.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(private readonly db: DatabaseService) {}

  async addAdmin({ email, name, password }: AddAdminBody) {
    const existingAdmin = await this.db.client.query.admin.findFirst({
      where: eq(admin.email, email),
    });
    if (existingAdmin) throw new BadRequestException('Admin already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const adminRecord = await this.db.client
      .insert(admin)
      .values({ email, name, password: hashedPassword })
      .returning();

    return adminRecord;
  }

  async getProfile(adminId: string) {
    return await this.db.client.query.admin.findFirst({
      where: eq(admin.id, adminId),
    });
  }

  async updateProfile(adminId: string, name: string) {
    const existingAdmin = await this.db.client.query.admin.findFirst({
      where: eq(admin.id, adminId),
    });
    if (!existingAdmin) throw new BadRequestException('Admin not found');

    const adminRecord = await this.db.client.update(admin).set({ name });
    return adminRecord;
  }
}
