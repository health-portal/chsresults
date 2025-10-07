import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { admin, token } from 'drizzle/schema';
import { DatabaseService } from 'src/database/database.service';
import { AddAdminBody, UpdateAdminBody } from './admin.schema';
import { EmailQueueService } from 'src/email-queue/email-queue.service';
import { InvitationTemplate } from 'src/email-queue/email-queue.schema';
import { env } from 'src/environment';
import { JwtPayload, TokenType, UserRole } from 'src/auth/auth.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {
  constructor(
    private readonly db: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly emailQueueService: EmailQueueService,
  ) {}

  private async generateToken(
    payload: JwtPayload,
    expiresIn: string | number | undefined,
  ) {
    const token = await this.jwtService.signAsync(payload, { expiresIn });
    return token;
  }

  async addAdmin({ email, name }: AddAdminBody) {
    const foundAdmin = await this.db.client.query.admin.findFirst({
      where: eq(admin.email, email),
    });
    if (foundAdmin) throw new BadRequestException('Admin already exists');

    const [insertedAdmin] = await this.db.client
      .insert(admin)
      .values({ email, name })
      .returning();

    const tokenString = await this.generateToken(
      { id: insertedAdmin.id, role: UserRole.ADMIN },
      '7d',
    );

    await this.db.client
      .insert(token)
      .values({
        userId: insertedAdmin.id,
        userRole: UserRole.ADMIN,
        tokenString,
        tokenType: TokenType.ACTIVATE_ACCOUNT,
      })
      .onConflictDoUpdate({
        target: [token.userId, token.userRole],
        set: { tokenString, tokenType: TokenType.ACTIVATE_ACCOUNT },
      });

    await this.emailQueueService.send({
      subject: 'Invitation to Verify Admin',
      toEmail: insertedAdmin.email,
      htmlContent: InvitationTemplate({
        name: insertedAdmin.name,
        registrationLink: `${env.FRONTEND_BASE_URL}/admin/activate/?token=${tokenString}`,
      }),
    });

    const { password: _, ...adminProfile } = insertedAdmin;
    return adminProfile;
  }

  async getAdmins() {
    return await this.db.client.query.admin.findMany({
      columns: { password: false },
    });
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
