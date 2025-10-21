import {
  BadRequestException,
  GoneException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import {
  SetPasswordBody,
  JwtPayload,
  RequestPasswordResetBody,
  SigninUserBody,
  UserRole,
} from './auth.schema';
import { desc, eq } from 'drizzle-orm';
import { student, token, user } from 'drizzle/schema';
import * as argon2 from 'argon2';
import { isEmail } from 'class-validator';
import { nanoid } from 'nanoid';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  private async findUserByEmail(email: string) {
    const foundUser = await this.db.client.query.user.findFirst({
      where: eq(user.email, email),
    });
    if (!foundUser) throw new NotFoundException('User not found');
    return foundUser;
  }

  private async findStudentByMatric(matricNumber: string) {
    const foundStudent = await this.db.client.query.student.findFirst({
      where: eq(student.matricNumber, matricNumber),
      with: {
        user: true,
      },
    });
    if (!foundStudent) throw new NotFoundException('Student not found');
    return foundStudent;
  }

  private async findUser(identifier: string, role: UserRole) {
    let foundUser: typeof user.$inferSelect;
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

  private async verifyToken(userId: string, tokenString: string) {
    const [foundToken] = await this.db.client
      .select()
      .from(token)
      .where(eq(token.userId, userId))
      .orderBy(desc(token.createdAt))
      .limit(1);

    if (!foundToken) throw new NotFoundException('Token not found');
    if (foundToken.expiresAt < new Date())
      throw new GoneException('Token has expired');

    const isValid = await argon2.verify(foundToken.tokenString, tokenString);
    if (!isValid) throw new BadRequestException('Invalid token');

    return foundToken;
  }

  private async createToken(userId: string, expiresInMinutes = 15) {
    const tokenString = nanoid();
    const hashedTokenString = await argon2.hash(tokenString);
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

    await this.db.client.insert(token).values({
      userId,
      tokenString: hashedTokenString,
      expiresAt,
    });
  }

  private async invalidateToken(userId: string) {
    await this.db.client.delete(token).where(eq(token.userId, userId));
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
    await this.verifyToken(userId, tokenString);

    const hashedPassword = await argon2.hash(password);
    await this.db.client
      .update(user)
      .set({ password: hashedPassword })
      .where(eq(user.id, userId));
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
      role: foundUser.role as UserRole,
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
    tokenString,
  }: SetPasswordBody) {
    const foundUser = await this.findUser(identifier, role);
    await this.verifyToken(tokenString, foundUser.id);

    const hashedPassword = await argon2.hash(password);
    await this.db.client
      .update(user)
      .set({ password: hashedPassword })
      .where(eq(user.id, foundUser.id));

    await this.invalidateToken(foundUser.id);

    return { message: 'Password reset successfully' };
  }
}
