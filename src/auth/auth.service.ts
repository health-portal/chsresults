import {
  BadRequestException,
  GoneException,
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
import { nanoid } from 'nanoid';
import { JwtService } from '@nestjs/jwt';
import { TokenType, User, UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
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

  private async verifyToken(userId: string, token: string) {
    const foundToken = await this.prisma.token.findUnique({
      where: { userId },
    });

    if (!foundToken) throw new NotFoundException('Token not found');
    if (foundToken.expiresAt < new Date())
      throw new GoneException('Token has expired');

    const isValid = await argon2.verify(foundToken.token, token);
    if (!isValid) throw new BadRequestException('Invalid token');

    return foundToken;
  }

  private async createToken(userId: string, expiresInMinutes = 15) {
    const token = nanoid();
    const hashedToken = await argon2.hash(token);
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

    await this.prisma.token.create({
      data: {
        userId,
        token: hashedToken,
        tokenType: TokenType.PASSWORD_RESET,
        expiresAt,
      },
    });
  }

  private async invalidateToken(userId: string) {
    await this.prisma.token.delete({ where: { userId } });
  }

  private async generateAccessToken(payload: JwtPayload) {
    return await this.jwtService.signAsync(payload, { expiresIn: '1d' });
  }

  async activateUser({ identifier, role, token, password }: SetPasswordBody) {
    const foundUser = await this.findUser(identifier, role);
    const userId = foundUser.id;
    await this.verifyToken(userId, token);

    const hashedPassword = await argon2.hash(password);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
    await this.invalidateToken(userId);

    return { message: 'Account activated successfully' };
  }

  async signinUser({ identifier, password, role }: SigninUserBody) {
    const foundUser = await this.findUser(identifier, role);
    if (!foundUser.password)
      throw new BadRequestException('Account not activated');

    const isPasswordValid = await argon2.verify(foundUser.password, password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const accessToken = await this.generateAccessToken({
      id: foundUser.id,
      role: foundUser.role,
    });

    return { accessToken };
  }

  async requestPasswordReset({ identifier, role }: RequestPasswordResetBody) {
    const foundUser = await this.findUser(identifier, role);
    await this.invalidateToken(foundUser.id);
    await this.createToken(foundUser.id);

    return { message: 'Password reset token generated' };
  }

  async confirmPasswordReset({
    identifier,
    password,
    role,
    token,
  }: SetPasswordBody) {
    const foundUser = await this.findUser(identifier, role);
    await this.verifyToken(token, foundUser.id);

    const hashedPassword = await argon2.hash(password);
    await this.prisma.user.update({
      where: { id: foundUser.id },
      data: { password: hashedPassword },
    });

    await this.invalidateToken(foundUser.id);

    return { message: 'Password reset successfully' };
  }
}
