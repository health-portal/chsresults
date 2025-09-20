import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';
import { JwtPayload, AuthUserBody, AuthStudentBody } from './auth.schema';
import { admin, lecturer, student } from 'drizzle/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  private generateAccessToken(payload: JwtPayload) {
    return { accessToken: this.jwtService.sign(payload) };
  }

  async activateAdminAccount({ email, password }: AuthUserBody) {
    const result = await this.db.client.query.admin.findFirst({
      where: eq(admin.email, email),
    });

    if (!result) throw new UnauthorizedException('Admin not found');
    if (result.password)
      throw new UnauthorizedException('Admin already activated');

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.db.client
      .update(admin)
      .set({ password: hashedPassword })
      .where(eq(admin.email, email));
  }

  async signinAdmin({ email, password }: AuthUserBody) {
    const result = await this.db.client.query.admin.findFirst({
      where: eq(admin.email, email),
    });

    if (!result) throw new UnauthorizedException('Admin not found');
    if (!result.password)
      throw new UnauthorizedException('Admin not activated');

    const isMatched = await bcrypt.compare(password, result.password);
    if (!isMatched) throw new UnauthorizedException('Invalid credentials');

    return this.generateAccessToken({ id: result.id, role: 'admin' });
  }

  async activateLecturerAccount({ email, password }: AuthUserBody) {
    const result = await this.db.client.query.lecturer.findFirst({
      where: eq(lecturer.email, email),
    });

    if (!result) throw new UnauthorizedException('Lecturer not found');
    if (result.password)
      throw new UnauthorizedException('Lecturer already activated');

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.db.client
      .update(lecturer)
      .set({ password: hashedPassword })
      .where(eq(lecturer.email, email));
  }

  async signinLecturer({ email, password }: AuthUserBody) {
    const result = await this.db.client.query.lecturer.findFirst({
      where: eq(lecturer.email, email),
    });

    if (!result) throw new UnauthorizedException('Lecturer not found');
    if (!result.password)
      throw new UnauthorizedException('Lecturer not activated');

    const isMatched = await bcrypt.compare(password, result.password);
    if (!isMatched) throw new UnauthorizedException('Invalid credentials');

    return this.generateAccessToken({ id: result.id, role: 'lecturer' });
  }

  async activateStudentAccount({
    email,
    matricNumber,
    password,
  }: AuthStudentBody) {
    const whereCondition = email
      ? eq(student.email, email)
      : eq(student.matricNumber, matricNumber!);

    const result = await this.db.client.query.student.findFirst({
      where: whereCondition,
    });

    if (!result) throw new UnauthorizedException('Student not found');
    if (result.password)
      throw new UnauthorizedException('Student already activated');

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.db.client
      .update(student)
      .set({ password: hashedPassword })
      .where(eq(student.id, result.id));
  }

  async signinStudent({ email, matricNumber, password }: AuthStudentBody) {
    const whereCondition = email
      ? eq(student.email, email)
      : eq(student.matricNumber, matricNumber!);

    const result = await this.db.client.query.student.findFirst({
      where: whereCondition,
    });

    if (!result) throw new UnauthorizedException('Student not found');
    if (!result.password)
      throw new UnauthorizedException('Student not activated');

    const isMatched = await bcrypt.compare(password, result.password);
    if (!isMatched) throw new UnauthorizedException('Invalid credentials');

    return this.generateAccessToken({ id: result.id, role: 'student' });
  }
}
