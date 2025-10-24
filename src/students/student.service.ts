import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ChangePasswordBody } from 'src/auth/auth.schema';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2';

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService) {}

  async changePassword(
    userId: string,
    { currentPassword, newPassword }: ChangePasswordBody,
  ) {
    const foundUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!foundUser) throw new NotFoundException('User not found');

    const isPasswordValid = await argon2.verify(
      foundUser.password!,
      currentPassword,
    );
    if (!isPasswordValid) throw new BadRequestException('Invalid password');

    const hashedPassword = await argon2.hash(newPassword);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  async listEnrollments(studentId: string) {
    return await this.prisma.enrollment.findMany({
      where: { studentId },
      include: { course: true, score: true, student: true },
    });
  }

  async listEnrollment(studentId: string, enrollmentId: string) {
    return await this.prisma.enrollment.findUnique({
      where: { id: enrollmentId, studentId },
      include: { course: true, score: true, student: true },
    });
  }

  async getProfile(studentId: string) {
    return await this.prisma.student.findUnique({
      where: { id: studentId },
      include: { user: true },
    });
  }
}
