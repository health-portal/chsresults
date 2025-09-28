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

  private async findAdmin(email: string) {
    return await this.db.client.query.admin.findFirst({
      where: eq(admin.email, email),
    });
  }

  private async updateAdminPassword(id: string, hashedPassword: string) {
    const [updatedAdmin] = await this.db.client
      .update(admin)
      .set({ password: hashedPassword })
      .where(eq(admin.id, id))
      .returning();

    const { password: _, ...adminProfile } = updatedAdmin;
    return adminProfile;
  }

  async activateAdmin({ email, password }: AuthUserBody) {
    const foundAdmin = await this.findAdmin(email);
    if (!foundAdmin) throw new UnauthorizedException(`Admin not found`);
    if (foundAdmin.password)
      throw new BadRequestException(`Admin already activated`);

    const hashedPassword = await bcrypt.hash(password, 10);
    return this.updateAdminPassword(foundAdmin.id, hashedPassword);
  }

  async signinAdmin({ email, password }: AuthUserBody) {
    const foundAdmin = await this.findAdmin(email);
    if (!foundAdmin) throw new UnauthorizedException(`Admin not found`);
    if (!foundAdmin.password)
      throw new ForbiddenException(`Admin not activated`);

    const isMatched = await bcrypt.compare(password, foundAdmin.password);
    if (!isMatched) throw new UnauthorizedException('Invalid credentials');

    return this.generateAccessToken({
      id: foundAdmin.id,
      role: UserRole.ADMIN,
    });
  }

  async adminResetPasswordRequest(email: string) {
    const foundAdmin = await this.findAdmin(email);
    if (!foundAdmin) throw new NotFoundException(`Admin not found`);

    await this.emailService.sendMail({
      subject: 'Reset Password',
      toEmail: [foundAdmin.email],
      htmlContent: ResetPasswordTemplate({
        name: foundAdmin.name,
        resetLink: '',
      }),
    });

    return { success: true, message: `Reset link sent to ${email}` };
  }

  async adminResetPassword({ email, password }: AuthUserBody) {
    const foundAdmin = await this.findAdmin(email);
    if (!foundAdmin) throw new NotFoundException(`Admin not found`);

    const hashedPassword = await bcrypt.hash(password, 10);
    return this.updateAdminPassword(foundAdmin.id, hashedPassword);
  }

  private async findLecturer(email: string) {
    return this.db.client.query.lecturer.findFirst({
      where: eq(lecturer.email, email),
    });
  }

  private async updateLecturerPassword(id: string, hashedPassword: string) {
    const [updatedLecturer] = await this.db.client
      .update(lecturer)
      .set({ password: hashedPassword })
      .where(eq(lecturer.id, id))
      .returning();

    const { password: _, ...lecturerProfile } = updatedLecturer;
    return lecturerProfile;
  }

  async activateLecturer({ email, password }: AuthUserBody) {
    const foundLecturer = await this.findLecturer(email);
    if (!foundLecturer) throw new UnauthorizedException(`Lecturer not found`);
    if (foundLecturer.password)
      throw new BadRequestException(`Lecturer already activated`);

    const hashedPassword = await bcrypt.hash(password, 10);
    return this.updateLecturerPassword(foundLecturer.id, hashedPassword);
  }

  async signinLecturer({ email, password }: AuthUserBody) {
    const foundLecturer = await this.findLecturer(email);
    if (!foundLecturer) throw new UnauthorizedException(`Lecturer not found`);
    if (!foundLecturer.password)
      throw new ForbiddenException(`Lecturer not activated`);

    const isMatched = await bcrypt.compare(password, foundLecturer.password);
    if (!isMatched) throw new UnauthorizedException('Invalid credentials');

    return this.generateAccessToken({
      id: foundLecturer.id,
      role: UserRole.LECTURER,
    });
  }

  async lecturerResetPasswordRequest(email: string) {
    const foundLecturer = await this.findLecturer(email);
    if (!foundLecturer) throw new NotFoundException(`Lecturer not found`);

    await this.emailService.sendMail({
      subject: 'Reset Password',
      toEmail: [foundLecturer.email],
      htmlContent: ResetPasswordTemplate({
        name: `${foundLecturer.firstName} ${foundLecturer.lastName}`,
        resetLink: '',
      }),
    });

    return { success: true, message: `Reset link sent to ${email}` };
  }

  async lecturerResetPassword({ email, password }: AuthUserBody) {
    const foundLecturer = await this.findLecturer(email);
    if (!foundLecturer) throw new NotFoundException(`Lecturer not found`);

    const hashedPassword = await bcrypt.hash(password, 10);
    return this.updateLecturerPassword(foundLecturer.id, hashedPassword);
  }

  private async findStudent({
    studentIdentifier,
    identifierType,
  }: StudentIdentifierBody) {
    const foundStudent = await this.db.client.query.student.findFirst({
      where:
        identifierType === StudentIdentifierType.EMAIL
          ? eq(student.email, studentIdentifier)
          : eq(student.matricNumber, studentIdentifier),
    });
    if (!foundStudent) throw new NotFoundException(`Student not found`);

    return foundStudent;
  }

  private async updateStudentPassword(id: string, hashedPassword: string) {
    const updated = await this.db.client
      .update(student)
      .set({ password: hashedPassword })
      .where(eq(student.id, id))
      .returning();

    const { password: _, ...profile } = updated[0];
    return profile;
  }

  async activateStudent({
    studentIdentifier,
    identifierType,
    password,
  }: AuthStudentBody) {
    const foundStudent = await this.findStudent({
      studentIdentifier,
      identifierType,
    });
    if (foundStudent.password)
      throw new UnauthorizedException(`Student already activated`);

    const hashedPassword = await bcrypt.hash(password, 10);
    return this.updateStudentPassword(foundStudent.id, hashedPassword);
  }

  async signinStudent({
    studentIdentifier,
    identifierType,
    password,
  }: AuthStudentBody) {
    const foundStudent = await this.findStudent({
      studentIdentifier,
      identifierType,
    });
    if (!foundStudent.password)
      throw new ForbiddenException(`Student not activated`);

    const isMatched = await bcrypt.compare(password, foundStudent.password);
    if (!isMatched) throw new UnauthorizedException('Invalid credentials');

    return this.generateAccessToken({
      id: foundStudent.id,
      role: UserRole.STUDENT,
    });
  }

  async studentResetPasswordRequest({
    studentIdentifier,
    identifierType,
  }: StudentIdentifierBody) {
    const foundStudent = await this.findStudent({
      studentIdentifier,
      identifierType,
    });

    await this.emailService.sendMail({
      subject: 'Reset Password',
      toEmail: [foundStudent.email],
      htmlContent: ResetPasswordTemplate({
        name: `${foundStudent.firstName} ${foundStudent.lastName}`,
        resetLink: '',
      }),
    });

    return {
      success: true,
      message: `Reset link sent to ${foundStudent.email}`,
    };
  }

  async studentResetPassword({
    studentIdentifier,
    identifierType,
    password,
  }: AuthStudentBody) {
    const foundStudent = await this.findStudent({
      studentIdentifier,
      identifierType,
    });

    const hashedPassword = await bcrypt.hash(password, 10);
    return this.updateStudentPassword(foundStudent.id, hashedPassword);
  }
}
