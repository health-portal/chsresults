import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from 'drizzle/schema';
import { env } from 'src/environment';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';
import { EmailQueueService } from 'src/email-queue/email-queue.service';
import { InvitationTemplate } from 'src/email-queue/email-queue.schema';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, TokenType, UserRole } from 'src/auth/auth.schema';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly emailQueueService: EmailQueueService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly pool = new Pool({ connectionString: env.DATABASE_URL });
  public readonly client: NodePgDatabase<typeof schema> = drizzle(this.pool, {
    schema,
  });

  async onModuleInit() {
    if (env.AUTO_SEED) {
      await this.seed();
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  private async generateToken(payload: JwtPayload, expiresIn: string = '7d') {
    const token = await this.jwtService.signAsync(payload, { expiresIn });
    return token;
  }

  async seed() {
    console.log('Starting database seed...');

    const defaultAdmins = env.DEFAULT_ADMINS;
    console.log(`Seeding ${defaultAdmins.length} admin(s)...`);

    const insertedAdmins = await this.client
      .insert(schema.admin)
      .values(
        defaultAdmins.map((admin) => ({
          id: uuidv4(),
          role: 'admin',
          ...admin,
        })),
      )
      .onConflictDoNothing({ target: schema.admin.email })
      .returning();

    for (const admin of insertedAdmins) {
      const tokenString = await this.generateToken(
        { id: admin.id, role: UserRole.ADMIN },
        '7d',
      );

      await this.client
        .insert(schema.token)
        .values({
          userId: admin.id,
          userRole: UserRole.ADMIN,
          tokenString,
          tokenType: TokenType.ACTIVATE_ACCOUNT,
        })
        .onConflictDoUpdate({
          target: [schema.token.userId, schema.token.userRole],
          set: { tokenString, tokenType: TokenType.ACTIVATE_ACCOUNT },
        });

      await this.emailQueueService.send({
        subject: 'Invitation to Activate Account',
        toEmail: admin.email,
        htmlContent: InvitationTemplate({
          name: admin.name,
          registrationLink: `${env.FRONTEND_BASE_URL}/admin/activate/?token=${tokenString}`,
        }),
      });
    }

    console.log('Admins seeded');

    const collegeOfHealthSciences: Record<string, string[]> = {
      'Basic Medical Sciences': [
        'Anatomy and Cell Biology',
        'Chemical Pathology',
        'Haematology and Immunology',
        'Medical Biochemistry',
        'Medical Pharmacology and Therapeutics',
        'Department of Medical Rehabilitation',
        'Morbid Anatomy and Forensic Medicine',
        'Nursing Science',
        'Physiological Sciences',
      ],
      'Faculty of Clinical Sciences': [
        'Anaethesia and Intensive Care',
        'Community Health',
        'Dermatology and Venereology',
        'Medicine',
        'Mental Health',
        'Obstetrics, Gyanaecology and Perinatology',
        'Ophthalmology',
        'Orthopaedic Surgery and Traumatology',
        'Otorhinolaryngology',
        'Paediatrics and Child Health',
        'Radiology',
        'Surgery',
      ],
      Dentistry: [
        'Child Dental Health',
        'Oral or Maxillofacial Surgery',
        'Oral Medicine and Oral Pathology',
        'Preventive and Community Dentistry',
        'Restorative Dentistry',
      ],
    };

    console.log('Seeding faculties and departments...');

    await this.client.transaction(async (tx) => {
      for (const [facultyName, departments] of Object.entries(
        collegeOfHealthSciences,
      )) {
        console.log(`Faculty: ${facultyName}`);

        let facultyRecord = await this.client.query.faculty.findFirst({
          where: eq(schema.faculty.name, facultyName),
        });

        if (!facultyRecord) {
          [facultyRecord] = await tx
            .insert(schema.faculty)
            .values({ name: facultyName })
            .onConflictDoNothing()
            .returning();
        }

        await tx
          .insert(schema.department)
          .values(
            departments.map((deptName) => ({
              name: deptName,
              facultyId: facultyRecord.id,
            })),
          )
          .onConflictDoNothing();
      }
    });

    console.log('Database seed complete');
  }
}
