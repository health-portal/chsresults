import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  SetPasswordBody,
  JwtPayload,
  RequestPasswordResetBody,
  SigninUserBody,
  UserData,
} from './auth.schema';
import * as argon2 from 'argon2';
import { isEmail } from 'class-validator';
import { JwtService } from '@nestjs/jwt';
import { TokenType, UserRole } from '@prisma/client';
import { TokensService } from 'src/tokens/tokens.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly tokensService: TokensService,
  ) {}

  private async findUserByEmail(email: string) {
    const foundUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!foundUser) throw new NotFoundException('User not found');
    return foundUser;
  }

  private async findStudentByMatric(matricNumber: string) {
    const foundStudent = await this.prisma.student.findUnique({
      where: { matricNumber },
      include: { user: true },
    });
    if (!foundStudent) throw new NotFoundException('Student not found');
    return foundStudent;
  }

  private async findUser(identifier: string, role: UserRole) {
    if (role !== UserRole.STUDENT)
      return await this.findUserByEmail(identifier);
    else {
      const foundUser = isEmail(identifier)
        ? await this.findUserByEmail(identifier)
        : (await this.findStudentByMatric(identifier)).user;

      return foundUser;
    }
  }

  private async getUserData(userId: string) {
    const foundUser = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        admin: {
          select: { id: true },
        },
        lecturer: {
          include: {
            designations: true,
            department: {
              select: { facultyId: true },
            },
          },
        },
        student: {
          include: {
            department: {
              select: { facultyId: true },
            },
          },
        },
      },
    });

    if (!foundUser) throw new NotFoundException('User not found');

    switch (foundUser.role) {
      case UserRole.ADMIN:
        if (!foundUser.admin)
          throw new Error('Admin data missing for admin user');
        return {
          adminId: foundUser.admin.id,
        };

      case UserRole.LECTURER:
        if (!foundUser.lecturer?.department)
          throw new Error('Lecturer data incomplete');

        return {
          lecturerId: foundUser.lecturer.id,
          departmentId: foundUser.lecturer.departmentId,
          facultyId: foundUser.lecturer.department.facultyId,
          designations: foundUser.lecturer.designations.map((designation) => ({
            entity: designation.entity,
            role: designation.role,
          })),
        };

      case UserRole.STUDENT:
        if (!foundUser.student?.department)
          throw new Error('Student data incomplete');
        return {
          studentId: foundUser.student.id,
          level: foundUser.student.level,

          facultyId: foundUser.student.department.facultyId,
          matricNumber: foundUser.student.matricNumber,
          departmentId: foundUser.student.departmentId,
        };

      default:
        throw new Error(`Unhandled user role`);
    }
  }

  private async generateAccessToken(payload: JwtPayload) {
    return await this.jwtService.signAsync(payload, { expiresIn: '1d' });
  }

  async activateUser({ identifier, role, token, password }: SetPasswordBody) {
    const foundUser = await this.findUser(identifier, role);
    const userId = foundUser.id;
    await this.tokensService.verifyToken(
      userId,
      token,
      TokenType.ACCOUNT_ACTIVATION,
    );

    const hashedPassword = await argon2.hash(password);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Account activated successfully' };
  }

  async signinUser({ identifier, password, role }: SigninUserBody) {
    const foundUser = await this.findUser(identifier, role);
    if (!foundUser.password)
      throw new BadRequestException('Account not activated');

    const isPasswordValid = await argon2.verify(foundUser.password, password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const userData: UserData = await this.getUserData(foundUser.id);

    const accessToken = await this.generateAccessToken({
      sub: foundUser.id,
      userRole: foundUser.role,
      userData,
    });

    return { accessToken };
  }

  async requestPasswordReset({ identifier, role }: RequestPasswordResetBody) {
    const foundUser = await this.findUser(identifier, role);
    await this.tokensService.createActivationToken(foundUser.id);

    // TODO: Send email with password reset token

    return { message: 'Password reset token generated' };
  }

  async confirmPasswordReset({
    identifier,
    password,
    role,
    token,
  }: SetPasswordBody) {
    const foundUser = await this.findUser(identifier, role);
    await this.tokensService.verifyToken(
      foundUser.id,
      token,
      TokenType.PASSWORD_RESET,
    );

    const hashedPassword = await argon2.hash(password);
    await this.prisma.user.update({
      where: { id: foundUser.id },
      data: { password: hashedPassword },
    });

    return { message: 'Password reset successfully' };
  }
}
