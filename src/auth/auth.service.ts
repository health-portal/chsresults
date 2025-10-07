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
  SigninUserBody,
  SigninStudentBody,
  StudentIdentifierType,
  StudentIdentifierBody,
  TokenType,
  VerifyUserBody,
  VerifyStudentBody,
} from './auth.schema';
import { admin, lecturer, student, token } from 'drizzle/schema';
import { and, eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { EmailQueueService } from 'src/email-queue/email-queue.service';
import { ResetPasswordTemplate } from 'src/email-queue/email-queue.schema';
import { env } from 'src/environment';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly emailQueueService: EmailQueueService,
  ) {}

  private async generateToken(payload: JwtPayload, expiresIn: string = '1d') {
    const token = await this.jwtService.signAsync(payload, { expiresIn });
    return token;
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

  async activateAdmin({ email, password, tokenString }: VerifyUserBody) {
    const foundAdmin = await this.findAdmin(email);
    if (!foundAdmin) throw new UnauthorizedException(`Admin not found`);
    if (foundAdmin.password)
      throw new BadRequestException(`Admin already activated`);

    const foundToken = await this.db.client.query.token.findFirst({
      where: and(
        eq(token.userId, foundAdmin.id),
        eq(token.userRole, UserRole.ADMIN),
      ),
    });

    if (!foundToken) throw new NotFoundException('Token not found');
    if (
      foundToken.tokenString !== tokenString ||
      foundToken.tokenType !== TokenType.ACTIVATE_ACCOUNT
    )
      throw new BadRequestException('Invalid or expired token');

    this.jwtService
      .verifyAsync(tokenString, { secret: env.JWT_SECRET })
      .then(() => {})
      .catch(() => {
        throw new BadRequestException('Invalid or expired token');
      });

    const hashedPassword = await bcrypt.hash(password, Number(env.BCRYPT_SALT));
    return this.updateAdminPassword(foundAdmin.id, hashedPassword);
  }

  async signinAdmin({ email, password }: SigninUserBody) {
    const foundAdmin = await this.findAdmin(email);
    if (!foundAdmin) throw new UnauthorizedException(`Admin not found`);
    if (!foundAdmin.password)
      throw new ForbiddenException(`Admin not activated`);

    const isMatched = await bcrypt.compare(password, foundAdmin.password);
    if (!isMatched) throw new UnauthorizedException('Invalid credentials');

    const accessToken = await this.generateToken({
      id: foundAdmin.id,
      role: UserRole.ADMIN,
    });
    return { accessToken };
  }

  async adminResetPasswordRequest(email: string) {
    const foundAdmin = await this.findAdmin(email);
    if (!foundAdmin) throw new NotFoundException(`Admin not found`);

    const tokenString = await this.generateToken(
      { id: foundAdmin.id, role: UserRole.ADMIN },
      '15m',
    );

    await this.db.client
      .insert(token)
      .values({
        userId: foundAdmin.id,
        userRole: UserRole.ADMIN,
        tokenString,
        tokenType: TokenType.RESET_PASSWORD,
      })
      .onConflictDoUpdate({
        target: [token.userId, token.userRole],
        set: { tokenString, tokenType: TokenType.RESET_PASSWORD },
      });

    await this.emailQueueService.send({
      subject: 'Reset Password',
      toEmail: foundAdmin.email,
      htmlContent: ResetPasswordTemplate({
        name: foundAdmin.name,
        resetLink: `${env.FRONTEND_BASE_URL}/admin/reset-password/?token=${tokenString}`,
      }),
    });

    return { success: true, message: `Reset link sent to ${email}` };
  }

  async adminResetPassword({ email, password, tokenString }: VerifyUserBody) {
    const foundAdmin = await this.findAdmin(email);
    if (!foundAdmin) throw new NotFoundException(`Admin not found`);

    const foundToken = await this.db.client.query.token.findFirst({
      where: and(
        eq(token.userId, foundAdmin.id),
        eq(token.userRole, UserRole.ADMIN),
      ),
    });

    if (!foundToken) throw new NotFoundException('Token not found');
    if (
      foundToken.tokenString !== tokenString ||
      foundToken.tokenType !== TokenType.RESET_PASSWORD
    )
      throw new BadRequestException('Invalid or expired token');

    this.jwtService
      .verifyAsync(tokenString, { secret: env.JWT_SECRET })
      .then(() => {})
      .catch(() => {
        throw new BadRequestException('Invalid or expired token');
      });

    const hashedPassword = await bcrypt.hash(password, Number(env.BCRYPT_SALT));
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

  async activateLecturer({ email, password, tokenString }: VerifyUserBody) {
    const foundLecturer = await this.findLecturer(email);
    if (!foundLecturer) throw new UnauthorizedException(`Lecturer not found`);
    if (foundLecturer.password)
      throw new BadRequestException(`Lecturer already activated`);

    const foundToken = await this.db.client.query.token.findFirst({
      where: and(
        eq(token.userId, foundLecturer.id),
        eq(token.userRole, UserRole.LECTURER),
      ),
    });

    if (!foundToken) throw new NotFoundException('Token not found');
    if (
      foundToken.tokenString !== tokenString ||
      foundToken.tokenType !== TokenType.ACTIVATE_ACCOUNT
    )
      throw new BadRequestException('Invalid or expired token');

    this.jwtService
      .verifyAsync(tokenString, { secret: env.JWT_SECRET })
      .then(() => {})
      .catch(() => {
        throw new BadRequestException('Invalid or expired token');
      });

    const hashedPassword = await bcrypt.hash(password, Number(env.BCRYPT_SALT));
    return this.updateLecturerPassword(foundLecturer.id, hashedPassword);
  }

  async signinLecturer({ email, password }: SigninUserBody) {
    const foundLecturer = await this.findLecturer(email);
    if (!foundLecturer) throw new UnauthorizedException(`Lecturer not found`);
    if (!foundLecturer.password)
      throw new ForbiddenException(`Lecturer not activated`);

    const isMatched = await bcrypt.compare(password, foundLecturer.password);
    if (!isMatched) throw new UnauthorizedException('Invalid credentials');

    const accessToken = await this.generateToken({
      id: foundLecturer.id,
      role: UserRole.LECTURER,
    });
    return { accessToken };
  }

  async lecturerResetPasswordRequest(email: string) {
    const foundLecturer = await this.findLecturer(email);
    if (!foundLecturer) throw new NotFoundException(`Lecturer not found`);

    const tokenString = await this.generateToken(
      { id: foundLecturer.id, role: UserRole.ADMIN },
      '15m',
    );

    await this.db.client
      .insert(token)
      .values({
        userId: foundLecturer.id,
        userRole: UserRole.LECTURER,
        tokenString,
        tokenType: TokenType.RESET_PASSWORD,
      })
      .onConflictDoUpdate({
        target: [token.userId, token.userRole],
        set: { tokenString, tokenType: TokenType.RESET_PASSWORD },
      });

    await this.emailQueueService.send({
      subject: 'Reset Password',
      toEmail: foundLecturer.email,
      htmlContent: ResetPasswordTemplate({
        name: `${foundLecturer.firstName} ${foundLecturer.lastName}`,
        resetLink: `${env.FRONTEND_BASE_URL}/lecturer/reset-password/?token=${tokenString}`,
      }),
    });

    return { success: true, message: `Reset link sent to ${email}` };
  }

  async lecturerResetPassword({
    email,
    password,
    tokenString,
  }: VerifyUserBody) {
    const foundLecturer = await this.findLecturer(email);
    if (!foundLecturer) throw new NotFoundException(`Lecturer not found`);

    const foundToken = await this.db.client.query.token.findFirst({
      where: and(
        eq(token.userId, foundLecturer.id),
        eq(token.userRole, UserRole.LECTURER),
      ),
    });

    if (!foundToken) throw new NotFoundException('Token not found');
    if (
      foundToken.tokenString !== tokenString ||
      foundToken.tokenType !== TokenType.RESET_PASSWORD
    )
      throw new BadRequestException('Invalid or expired token');

    this.jwtService
      .verifyAsync(tokenString, { secret: env.JWT_SECRET })
      .then(() => {})
      .catch(() => {
        throw new BadRequestException('Invalid or expired token');
      });

    const hashedPassword = await bcrypt.hash(password, Number(env.BCRYPT_SALT));
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
    const [updatedStudent] = await this.db.client
      .update(student)
      .set({ password: hashedPassword })
      .where(eq(student.id, id))
      .returning();

    const { password: _, ...studentProfile } = updatedStudent;
    return studentProfile;
  }

  async activateStudent({
    studentIdentifier,
    identifierType,
    password,
    tokenString,
  }: VerifyStudentBody) {
    const foundStudent = await this.findStudent({
      studentIdentifier,
      identifierType,
    });
    if (foundStudent.password)
      throw new UnauthorizedException(`Student already activated`);

    const foundToken = await this.db.client.query.token.findFirst({
      where: and(
        eq(token.userId, foundStudent.id),
        eq(token.userRole, UserRole.STUDENT),
      ),
    });

    if (!foundToken) throw new NotFoundException('Token not found');
    if (
      foundToken.tokenString !== tokenString ||
      foundToken.tokenType !== TokenType.ACTIVATE_ACCOUNT
    )
      throw new BadRequestException('Invalid or expired token');

    this.jwtService
      .verifyAsync(tokenString, { secret: env.JWT_SECRET })
      .then(() => {})
      .catch(() => {
        throw new BadRequestException('Invalid or expired token');
      });

    const hashedPassword = await bcrypt.hash(password, Number(env.BCRYPT_SALT));
    return this.updateStudentPassword(foundStudent.id, hashedPassword);
  }

  async signinStudent({
    studentIdentifier,
    identifierType,
    password,
  }: SigninStudentBody) {
    const foundStudent = await this.findStudent({
      studentIdentifier,
      identifierType,
    });
    if (!foundStudent.password)
      throw new ForbiddenException(`Student not activated`);

    const isMatched = await bcrypt.compare(password, foundStudent.password);
    if (!isMatched) throw new UnauthorizedException('Invalid credentials');

    const accessToken = await this.generateToken({
      id: foundStudent.id,
      role: UserRole.STUDENT,
    });
    return { accessToken };
  }

  async studentResetPasswordRequest({
    studentIdentifier,
    identifierType,
  }: StudentIdentifierBody) {
    const foundStudent = await this.findStudent({
      studentIdentifier,
      identifierType,
    });

    const tokenString = await this.generateToken(
      { id: foundStudent.id, role: UserRole.ADMIN },
      '15m',
    );

    await this.db.client
      .insert(token)
      .values({
        userId: foundStudent.id,
        userRole: UserRole.LECTURER,
        tokenString,
        tokenType: TokenType.RESET_PASSWORD,
      })
      .onConflictDoUpdate({
        target: [token.userId, token.userRole],
        set: { tokenString, tokenType: TokenType.RESET_PASSWORD },
      });

    await this.emailQueueService.send({
      subject: 'Reset Password',
      toEmail: foundStudent.email,
      htmlContent: ResetPasswordTemplate({
        name: `${foundStudent.firstName} ${foundStudent.lastName}`,
        resetLink: `${env.FRONTEND_BASE_URL}/student/reset-password/?token=${tokenString}`,
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
    tokenString,
  }: VerifyStudentBody) {
    const foundStudent = await this.findStudent({
      studentIdentifier,
      identifierType,
    });

    const foundToken = await this.db.client.query.token.findFirst({
      where: and(
        eq(token.userId, foundStudent.id),
        eq(token.userRole, UserRole.STUDENT),
      ),
    });

    if (!foundToken) throw new NotFoundException('Token not found');
    if (
      foundToken.tokenString !== tokenString ||
      foundToken.tokenType !== TokenType.RESET_PASSWORD
    )
      throw new BadRequestException('Invalid or expired token');

    this.jwtService
      .verifyAsync(tokenString, { secret: env.JWT_SECRET })
      .then(() => {})
      .catch(() => {
        throw new BadRequestException('Invalid or expired token');
      });

    const hashedPassword = await bcrypt.hash(password, Number(env.BCRYPT_SALT));
    return this.updateStudentPassword(foundStudent.id, hashedPassword);
  }
}
