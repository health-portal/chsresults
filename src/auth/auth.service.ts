import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';
import {
  JwtPayload,
  UserRole,
  AuthUserBody,
  AuthStudentBody,
  StudentIdentifierType,
  StudentIdentifierBody,
} from './auth.schema';
import { admin, lecturer, student } from 'drizzle/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/email/email.service';
import { ResetPasswordTemplate } from 'src/email/email.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  private generateAccessToken(payload: JwtPayload) {
    return { accessToken: this.jwtService.sign(payload) };
  }

  private async findAdminOrLecturer(role: UserRole, email: string) {
    switch (role) {
      case UserRole.ADMIN:
        return await this.db.client.query.admin.findFirst({
          where: eq(admin.email, email),
        });
      case UserRole.LECTURER:
        return await this.db.client.query.lecturer.findFirst({
          where: eq(lecturer.email, email),
        });
      default:
        throw new UnauthorizedException('Role not supported here');
    }
  }

  private async findStudent({
    studentIdentifier,
    identifierType,
  }: StudentIdentifierBody) {
    const studentRecord = await this.db.client.query.student.findFirst({
      where:
        identifierType === StudentIdentifierType.EMAIL
          ? eq(student.email, studentIdentifier)
          : eq(student.matricNumber, studentIdentifier),
    });
    if (!studentRecord) throw new NotFoundException(`Student not found`);

    return studentRecord;
  }

  private async updatePassword(
    role: UserRole,
    id: string,
    hashedPassword: string,
  ) {
    switch (role) {
      case UserRole.ADMIN: {
        const updatedAdmin = await this.db.client
          .update(admin)
          .set({ password: hashedPassword })
          .where(eq(admin.id, id))
          .returning();

        const { password, ...adminProfile } = updatedAdmin[0];
        return adminProfile;
      }

      case UserRole.LECTURER: {
        const updatedLecturer = await this.db.client
          .update(lecturer)
          .set({ password: hashedPassword })
          .where(eq(lecturer.id, id))
          .returning();

        const { password, ...lecturerProfile } = updatedLecturer[0];
        return lecturerProfile;
      }

      case UserRole.STUDENT: {
        const updatedStudent = await this.db.client
          .update(student)
          .set({ password: hashedPassword })
          .where(eq(student.id, id))
          .returning();

        const { password, ...studentProfile } = updatedStudent[0];
        return studentProfile;
      }

      default:
        throw new UnauthorizedException('Role not supported here');
    }
  }

  async activate(role: UserRole, { email, password }: AuthUserBody) {
    const user = await this.findAdminOrLecturer(role, email);
    if (!user) throw new UnauthorizedException(`${role} not found`);
    if (user.password)
      throw new BadRequestException(`${role} already activated`);

    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.updatePassword(role, user.id, hashedPassword);
  }

  async signin(role: UserRole, { email, password }: AuthUserBody) {
    const user = await this.findAdminOrLecturer(role, email);
    if (!user) throw new UnauthorizedException(`${role} not found`);
    if (!user.password) throw new ForbiddenException(`${role} not activated`);

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) throw new UnauthorizedException('Invalid credentials');

    return this.generateAccessToken({ id: user.id, role });
  }

  async resetPasswordRequest(role: UserRole, email: string) {
    const user: typeof admin.$inferSelect | typeof lecturer.$inferSelect =
      await this.findAdminOrLecturer(role, email);
    if (!user) throw new NotFoundException(`${role} not found`);

    const name =
      role === UserRole.ADMIN
        ? user.name
        : `${user.firstName} ${user.lastName}`;

    await this.emailService.sendMail({
      subject: 'Reset Password',
      toEmail: [user.email],
      htmlContent: ResetPasswordTemplate({
        name,
        resetLink: '',
      }),
    });

    return { success: true, message: `Reset link sent to ${email}` };
  }

  async resetPassword(role: UserRole, { email, password }: AuthUserBody) {
    const user = await this.findAdminOrLecturer(role, email);
    if (!user) throw new NotFoundException(`${role} not found`);

    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.updatePassword(role, user.id, hashedPassword);
  }

  async activateStudentAccount({
    studentIdentifier,
    identifierType,
    password,
  }: AuthStudentBody) {
    const studentRecord = await this.findStudent({
      studentIdentifier,
      identifierType,
    });
    if (studentRecord.password)
      throw new UnauthorizedException(`Student already activated`);

    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.updatePassword(
      UserRole.STUDENT,
      studentRecord.id,
      hashedPassword,
    );
  }

  async signinStudent({
    studentIdentifier,
    identifierType,
    password,
  }: AuthStudentBody) {
    const studentRecord = await this.findStudent({
      studentIdentifier,
      identifierType,
    });
    if (!studentRecord.password)
      throw new ForbiddenException(`$Student not activated`);

    const isMatched = await bcrypt.compare(password, studentRecord.password);
    if (!isMatched) throw new UnauthorizedException('Invalid credentials');

    return this.generateAccessToken({
      id: studentRecord.id,
      role: UserRole.STUDENT,
    });
  }

  async studentResetPasswordRequest({
    studentIdentifier,
    identifierType,
  }: StudentIdentifierBody) {
    const studentRecord = await this.findStudent({
      studentIdentifier,
      identifierType,
    });

    await this.emailService.sendMail({
      subject: 'Reset Password',
      toEmail: [studentRecord.email],
      htmlContent: ResetPasswordTemplate({
        name: `${studentRecord.firstName} ${studentRecord.lastName}`,
        resetLink: '',
      }),
    });

    return {
      success: true,
      message: `Reset link sent to ${studentRecord.email}`,
    };
  }

  async studentResetPassword({
    studentIdentifier,
    identifierType,
    password,
  }: AuthStudentBody) {
    const studentRecord = await this.findStudent({
      studentIdentifier,
      identifierType,
    });

    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.updatePassword(
      UserRole.STUDENT,
      studentRecord.id,
      hashedPassword,
    );
  }
}
