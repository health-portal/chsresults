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
} from './auth.schema';
import * as argon2 from 'argon2';
import { isEmail } from 'class-validator';
import { JwtService } from '@nestjs/jwt';
import { StaffRole, TokenType, User, UserRole } from '@prisma/client';
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
    let foundUser: User;
    if (role === UserRole.STAFF)
      foundUser = await this.findUserByEmail(identifier);
    else if (role === UserRole.STUDENT) {
      if (isEmail(identifier)) {
        foundUser = await this.findUserByEmail(identifier);
      } else {
        const foundStudent = await this.findStudentByMatric(identifier);
        foundUser = foundStudent.user;
      }
    } else {
      throw new BadRequestException('Invalid role');
    }

    return foundUser;
  }

  private async getUserDetails(userId: string) {
    const foundUser = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { student: true, staff: true },
    });

    if (!foundUser) throw new NotFoundException('User not found');

    let userDetails: { userId: string; staffRole?: StaffRole };
    if (foundUser.role === UserRole.STAFF) {
      if (!foundUser.staff)
        throw new NotFoundException('Staff details not found');
      userDetails = {
        userId: foundUser.staff.id,
        staffRole: foundUser.staff.role,
      };
    } else if (foundUser.role === UserRole.STUDENT) {
      if (!foundUser.student)
        throw new NotFoundException('Student details not found');
      userDetails = {
        userId: foundUser.student.id,
      };
    } else {
      throw new BadRequestException('Invalid user role');
    }

    return userDetails;
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

    const { userId, staffRole } = await this.getUserDetails(foundUser.id);

    const accessToken = await this.generateAccessToken({
      sub: foundUser.id,
      userId,
      userRole: foundUser.role,
      staffRole,
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
