import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { createAuth } from 'src/lib/auth';
import { SigninStudentBody } from './auth.schema';
import { user } from 'drizzle/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class AuthService {
  public readonly auth = createAuth();

  constructor(private readonly db: DatabaseService) {}

  async signinStudent({ email, matricNumber, password }: SigninStudentBody) {
    const whereCondition = email
      ? eq(user.email, email)
      : eq(user.matricNumber, matricNumber);

    const student = await this.db.client
      .select({ email: user.email, role: user.role })
      .from(user)
      .where(whereCondition)
      .limit(1);

    if (!student.length) {
      throw new UnauthorizedException('Invalid student credentials');
    }

    if (student[0].role !== 'student') {
      throw new UnauthorizedException('Only students can sign in here');
    }

    return this.auth.api.signInEmail({
      body: { email: student[0].email, password },
    });
  }
}
