import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateLecturerBody,
  CreateLecturersRes,
  UpdateLecturerBody,
} from './lecturers.schema';
import { UserRole } from 'prisma/client/database';
import { parseCsv } from 'src/lib/csv';

@Injectable()
export class LecturersService {
  constructor(private readonly prisma: PrismaService) {}

  async createLecturer({
    email,
    firstName,
    lastName,
    otherName,
    department,
    phone,
    title,
  }: CreateLecturerBody) {
    await this.prisma.user.create({
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
      include: { lecturer: true },
    });
  }

  async createLecturers(file: Express.Multer.File) {
    const content = file.buffer.toString('utf-8');
    const parsedData = await parseCsv(content, CreateLecturerBody);
    const result: CreateLecturersRes = { lecturers: [], ...parsedData };

    for (const row of parsedData.validRows) {
      try {
        await this.prisma.user.create({
          data: {
            email: row.email,
            role: UserRole.LECTURER,
            lecturer: {
              create: {
                firstName: row.firstName,
                lastName: row.lastName,
                otherName: row.otherName,
                department: { connect: { name: row.department } },
                phone: row.phone,
                title: row.title,
              },
            },
          },
        });

        result.lecturers.push({ ...row, isCreated: true });
      } catch {
        result.lecturers.push({ ...row, isCreated: false });
      }
    }

    return result;
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
