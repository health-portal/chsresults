import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { admin } from 'drizzle/schema';
import { DatabaseService } from 'src/database/database.service';
import { AddAdminBody, UpdateAdminBody } from './admin.schema';
import { EmailService } from 'src/email/email.service';
import { InvitationTemplate } from 'src/email/email.schema';

@Injectable()
export class AdminService {
  constructor(
    private readonly db: DatabaseService,
    private readonly emailService: EmailService,
  ) {}

  async addAdmin({ email, name }: AddAdminBody) {
    const foundAdmin = await this.db.client.query.admin.findFirst({
      where: eq(admin.email, email),
    });
    if (foundAdmin) throw new BadRequestException('Admin already exists');

    const [insertedAdmin] = await this.db.client
      .insert(admin)
      .values({ email, name })
      .returning();

    await this.emailService.sendMail({
      subject: 'Invitation to Activate Admin',
      toEmail: insertedAdmin.email,
      htmlContent: InvitationTemplate({
        name: insertedAdmin.name,
        registrationLink: '',
      }),
    });

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
      .where(eq(admin.id, foundAdmin.id))
      .returning();

    const { password: _, ...adminProfile } = updatedAdmin;
    return adminProfile;
  }
}
