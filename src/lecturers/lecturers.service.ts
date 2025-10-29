import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateLecturerBody,
  CreateLecturersRes,
  UpdateLecturerBody,
} from './lecturers.schema';
import { UserRole } from '@prisma/client';
import { parseCsv } from 'src/lib/csv';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

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
    try {
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
        include: { lecturer: true },
      });

      return createdUser;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException(
            'A user with this email or phone already exists',
          );
        }
      }
      throw new BadRequestException('Failed to create lecturer');
    }
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
    return await this.prisma.lecturer.findMany({ where: { deletedAt: null } });
  }

  async updateLecturer(
    id: string,
    {
      firstName,
      lastName,
      otherName,
      department,
      phone,
      title,
    }: UpdateLecturerBody,
  ) {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
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

      return updatedUser;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new BadRequestException('Lecturer not found');
        }
      }

      throw new BadRequestException('Failed to update lecturer');
    }
  }

  async deleteLecturer(lecturerId: string) {
    try {
      const deletedUser = await this.prisma.user.update({
        where: { id: lecturerId },
        data: { deletedAt: new Date() },
      });

      return deletedUser;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new BadRequestException('Lecturer not found');
        }
      }

      throw new BadRequestException('Failed to delete lecturer');
    }
  }
}
