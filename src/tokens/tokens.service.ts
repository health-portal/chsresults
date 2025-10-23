import { randomBytes } from 'crypto';
import { TokenType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

export class TokensService {
  constructor(private prisma: PrismaService) {}

  private generateTokenString() {
    return randomBytes(32).toString('hex');
  }

  async createActivationToken(userId: string) {
    const token = this.generateTokenString();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.prisma.token.upsert({
      where: { userId },
      update: { token, tokenType: TokenType.ACCOUNT_ACTIVATION, expiresAt },
      create: {
        token,
        tokenType: TokenType.ACCOUNT_ACTIVATION,
        expiresAt,
        userId,
      },
    });
  }

  async createPasswordResetToken(userId: string) {
    const token = this.generateTokenString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await this.prisma.token.upsert({
      where: { userId },
      update: { token, tokenType: TokenType.PASSWORD_RESET, expiresAt },
      create: { token, tokenType: TokenType.PASSWORD_RESET, expiresAt, userId },
    });
  }

  async verifyToken(userId: string, token: string, type: TokenType) {
    const foundToken = await this.prisma.token.findUnique({
      where: { userId },
    });

    if (!foundToken) throw new BadRequestException('Token not foundToken');
    if (foundToken.token !== token)
      throw new BadRequestException('Invalid token');
    if (foundToken.tokenType !== type)
      throw new BadRequestException('Token type mismatch');
    if (foundToken.expiresAt < new Date())
      throw new BadRequestException('Token expired');
  }
}
