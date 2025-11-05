import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
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
import { TokenType, UserRole } from 'prisma/client/database';
import { env } from 'src/lib/environment';
import { generateResetPasswordToken } from 'src/lib/tokens';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private async findUserByEmail(email: string, role: UserRole) {
    return await this.prisma.user.findUniqueOrThrow({
      where: { email, role },
    });
  }

  private async findUserByMatric(matricNumber: string) {
    const { user: foundUser } = await this.prisma.student.findUniqueOrThrow({
      where: { matricNumber },
      select: { user: true },
    });

    return foundUser;
  }

  private async findUser(identifier: string, role: UserRole) {
    if (role !== UserRole.STUDENT)
      return await this.findUserByEmail(identifier, role);
    else {
      const foundUser = isEmail(identifier)
        ? await this.findUserByEmail(identifier, role)
        : await this.findUserByMatric(identifier);

      return foundUser;
    }
  }

  private async getUserData(userId: string) {
    const foundUser = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        email: true,
        admin: {
          select: { id: true },
        },
        lecturer: {
          select: {
            id: true,
            departmentId: true,
            designations: true,
            department: {
              select: { facultyId: true },
            },
          },
        },
        student: {
          select: {
            id: true,
            departmentId: true,
            matricNumber: true,
            level: true,
            department: {
              select: { facultyId: true },
            },
          },
        },
      },
    });

    switch (foundUser.role) {
      case UserRole.ADMIN:
        return { adminId: foundUser.admin!.id };

      case UserRole.LECTURER:
        return {
          lecturerId: foundUser.lecturer!.id,
          departmentId: foundUser.lecturer!.departmentId,
          facultyId: foundUser.lecturer!.department.facultyId,
          designations: foundUser.lecturer!.designations.map((designation) => ({
            entity: designation.entity,
            role: designation.role,
          })),
        };

      case UserRole.STUDENT:
        return {
          studentId: foundUser.student!.id,
          level: foundUser.student!.level,
          facultyId: foundUser.student!.department.facultyId,
          matricNumber: foundUser.student!.matricNumber,
          departmentId: foundUser.student!.departmentId,
        };

      default:
        throw new UnprocessableEntityException(`User role does not exist`);
    }
  }

  private async verifyToken(
    userId: string,
    tokenString: string,
    tokenType: TokenType,
  ) {
    const foundTokenData = await this.prisma.tokenData.findUnique({
      where: { userId },
    });

    if (
      !foundTokenData ||
      foundTokenData.tokenString !== tokenString ||
      foundTokenData.tokenType !== tokenType ||
      foundTokenData.expiresAt < new Date()
    )
      throw new BadRequestException('Non-existent or invalid token');
  }

  private async generateAccessToken(payload: JwtPayload) {
    return await this.jwtService.signAsync(payload, { expiresIn: '1d' });
  }

  async activateUser({
    identifier,
    role,
    tokenString,
    password,
  }: SetPasswordBody) {
    const foundUser = await this.findUser(identifier, role);
    const userId = foundUser.id;

    if (foundUser.password)
      throw new ConflictException('User already activated');

    await this.verifyToken(userId, tokenString, TokenType.ACCOUNT_ACTIVATION);

    const hashedPassword = await argon2.hash(password);
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
      select: { id: true, email: true, role: true },
    });

    return updatedUser;
  }

  async signinUser({ identifier, password, role }: SigninUserBody) {
    const foundUser = await this.findUser(identifier, role);
    if (!foundUser.password) throw new ForbiddenException('User not activated');

    const isPasswordValid = await argon2.verify(foundUser.password, password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const userData: UserData = await this.getUserData(foundUser.id);

    const accessToken = await this.generateAccessToken({
      sub: foundUser.id,
      email: foundUser.email,
      userRole: foundUser.role,
      userData,
    });

    return { accessToken };
  }

  async requestPasswordReset({ identifier, role }: RequestPasswordResetBody) {
    const foundUser = await this.findUser(identifier, role);
    const { tokenString, expiresAt } = generateResetPasswordToken();

    await this.prisma.tokenData.upsert({
      where: { userId: foundUser.id },
      update: {
        tokenString,
        tokenType: TokenType.PASSWORD_RESET,
        expiresAt,
      },
      create: {
        tokenString,
        tokenType: TokenType.PASSWORD_RESET,
        expiresAt,
        userId: foundUser.id,
      },
    });

    // TODO: Send email with password reset token
    const resetPasswordUrl = new URL(env.FRONTEND_BASE_URL + '/reset-password');
    resetPasswordUrl.searchParams.set('email', identifier);
    resetPasswordUrl.searchParams.set('role', role);
    resetPasswordUrl.searchParams.set('token', tokenString);
    console.log(resetPasswordUrl);

    return { message: 'Password reset request sent' };
  }

  async confirmPasswordReset({
    identifier,
    password,
    role,
    tokenString,
  }: SetPasswordBody) {
    const foundUser = await this.findUser(identifier, role);
    await this.verifyToken(foundUser.id, tokenString, TokenType.PASSWORD_RESET);

    const hashedPassword = await argon2.hash(password);
    const updatedUser = await this.prisma.user.update({
      where: { id: foundUser.id },
      data: { password: hashedPassword },
      select: { id: true, email: true, role: true },
    });

    return updatedUser;
  }
}
