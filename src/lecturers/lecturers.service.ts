import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import {
  CreateLecturerBody,
  CreateLecturersResponse,
  UpdateLecturerBody,
} from './lecturers.schema';
import { department, lecturer, token } from 'drizzle/schema';
import { eq } from 'drizzle-orm';
import { parseCsvFile } from 'src/utils/csv';
import { JwtService } from '@nestjs/jwt';
import { EmailQueueService } from 'src/email-queue/email-queue.service';
import { JwtPayload, TokenType, UserRole } from 'src/auth/auth.schema';
import { InvitationTemplate } from 'src/email-queue/email-queue.schema';
import { env } from 'src/environment';

@Injectable()
export class LecturersService {
  constructor(
    private readonly db: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly emailQueueService: EmailQueueService,
  ) {}

  private async generateToken(
    payload: JwtPayload,
    expiresIn: string | number | undefined = '1d',
  ) {
    const token = await this.jwtService.signAsync(payload, { expiresIn });
    return token;
  }

  async inviteLecturer(id: string, email: string, name: string) {
    const tokenString = await this.generateToken(
      { id, role: UserRole.LECTURER },
      '7d',
    );

    await this.db.client
      .insert(token)
      .values({
        userId: id,
        userRole: UserRole.LECTURER,
        tokenString,
        tokenType: TokenType.ACTIVATE_ACCOUNT,
      })
      .onConflictDoUpdate({
        target: [token.userId, token.userRole],
        set: { tokenString, tokenType: TokenType.ACTIVATE_ACCOUNT },
      });

    await this.emailQueueService.send({
      subject: 'Invitation to Activate Account',
      toEmail: email,
      htmlContent: InvitationTemplate({
        name,
        registrationLink: `${env.FRONTEND_BASE_URL}/activate/?token=${tokenString}&type=lecturer`,
      }),
    });
  }

  async createLecturer(body: CreateLecturerBody) {
    const foundLecturer = await this.db.client.query.lecturer.findFirst({
      where: eq(lecturer.email, body.email),
    });
    if (foundLecturer)
      throw new BadRequestException('Lecturer already registered');

    const foundDepartment = await this.db.client.query.department.findFirst({
      where: eq(department.name, body.department),
    });
    if (!foundDepartment) throw new BadRequestException('Department not found');

    const [insertedLecturer] = await this.db.client
      .insert(lecturer)
      .values({ ...body, departmentId: foundDepartment.id })
      .returning();

    await this.inviteLecturer(
      insertedLecturer.id,
      insertedLecturer.email,
      `${insertedLecturer.title} ${insertedLecturer.firstName} ${insertedLecturer.lastName}`,
    );

    const { password: _, ...lecturerProfile } = insertedLecturer;
    return lecturerProfile;
  }

  async createLecturers(file: Express.Multer.File) {
    const parsedData = await parseCsvFile(file, CreateLecturerBody);
    const result: CreateLecturersResponse = { lecturers: [], ...parsedData };

    await this.db.client.transaction(async (tx) => {
      for (const row of parsedData.validRows) {
        const foundDepartment = await tx.query.department.findFirst({
          where: eq(department.name, row.department),
        });
        if (!foundDepartment)
          result.lecturers.push({ ...row, isCreated: false });
        else {
          const [insertedLecturer] = await tx
            .insert(lecturer)
            .values({ ...row, departmentId: foundDepartment.id })
            .returning()
            .onConflictDoNothing();

          if (insertedLecturer) {
            result.lecturers.push({ ...row, isCreated: true });
            await this.inviteLecturer(
              insertedLecturer.id,
              insertedLecturer.email,
              `${insertedLecturer.title} ${insertedLecturer.firstName} ${insertedLecturer.lastName}`,
            );
          } else result.lecturers.push({ ...row, isCreated: false });
        }
      }
    });

    return result;
  }

  async getLecturers() {
    const foundLecturers = await this.db.client.query.lecturer.findMany();
    return foundLecturers.map((l) => {
      const { password: _, ...lecturerProfile } = l;
      return lecturerProfile;
    });
  }

  async updateLecturer(lecturerId: string, body: UpdateLecturerBody) {
    const foundLecturer = await this.db.client.query.lecturer.findFirst({
      where: eq(lecturer.id, lecturerId),
    });
    if (!foundLecturer) throw new BadRequestException('Lecturer not found');

    const [updatedLecturer] = await this.db.client
      .update(lecturer)
      .set(body)
      .where(eq(lecturer.id, lecturerId))
      .returning();
    const { password: _, ...lecturerProfile } = updatedLecturer;
    return lecturerProfile;
  }

  async deleteLecturer(lecturerId: string) {
    const [foundLecturer] = await this.db.client
      .delete(lecturer)
      .where(eq(lecturer.id, lecturerId))
      .returning();
    if (!foundLecturer) throw new NotFoundException('Lecturer not found');

    const { password: _, ...lecturerProfile } = foundLecturer;
    return lecturerProfile;
  }
}
