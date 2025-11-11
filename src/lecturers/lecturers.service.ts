import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLecturerBody, UpdateLecturerBody } from './lecturers.schema';
import { FileCategory, UserRole } from 'prisma/client/database';
import { UploadFileBody } from 'src/files/files.schema';
import { MessageQueueService } from 'src/message-queue/message-queue.service';
import { TokensService } from 'src/tokens/tokens.service';
import {
  EmailSubject,
  QueueTable,
  SendEmailPayload,
  SetPasswordTemplate,
} from 'src/message-queue/message-queue.schema';

@Injectable()
export class LecturersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly messageQueueService: MessageQueueService,
    private readonly tokensService: TokensService,
  ) {}

  async createLecturer({
    email,
    firstName,
    lastName,
    otherName,
    department,
    phone,
    title,
  }: CreateLecturerBody) {
    const createdUser = await this.prisma.user.create({
      data: {
        email,
        role: UserRole.LECTURER,
        lecturer: {
          create: {
            firstName,
            lastName,
            otherName,
            department: { connect: { name: department } },
            phone,
            title,
          },
        },
      },
    });

    const url = await this.tokensService.genActivateAccountUrl({
      email: createdUser.email,
      role: UserRole.LECTURER,
      sub: createdUser.id,
    });

    const payload: SendEmailPayload = {
      toEmail: createdUser.email,
      content: SetPasswordTemplate({
        isActivateAccount: true,
        setPasswordLink: url,
      }),
      subject: EmailSubject.ACTIVATE_ACCOUNT,
    };

    await this.messageQueueService.enqueueEmails(
      QueueTable.HI_PRIORITY_EMAILS,
      [payload],
    );
  }

  async uploadFileForLecturers(
    userId: string,
    { filename, content }: UploadFileBody,
  ) {
    await this.prisma.file.create({
      data: {
        filename,
        content: Buffer.from(JSON.stringify(content), 'utf-8'),
        userId,
        category: FileCategory.LECTURERS,
      },
    });
  }

  async getLecturers() {
    const foundLecturers = await this.prisma.lecturer.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        otherName: true,
        title: true,
        phone: true,
        qualification: true,
        department: { select: { name: true } },
        user: { select: { email: true } },
      },
    });

    return foundLecturers.map((lecturer) => ({
      id: lecturer.id,
      firstName: lecturer.firstName,
      lastName: lecturer.lastName,
      otherName: lecturer.otherName,
      phone: lecturer.phone,
      title: lecturer.title,
      qualification: lecturer.qualification,
      department: lecturer.department.name,
      email: lecturer.user.email,
    }));
  }

  async updateLecturer(
    lecturerId: string,
    {
      firstName,
      lastName,
      otherName,
      department,
      phone,
      title,
    }: UpdateLecturerBody,
  ) {
    await this.prisma.user.update({
      where: { id: lecturerId },
      data: {
        lecturer: {
          update: {
            firstName,
            lastName,
            otherName,
            department: { connect: { name: department } },
            phone,
            title,
          },
        },
      },
      include: { lecturer: true },
    });
  }

  async deleteLecturer(lecturerId: string) {
    await this.prisma.user.update({
      where: { id: lecturerId },
      data: { deletedAt: new Date() },
    });
  }
}
