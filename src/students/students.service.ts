import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateStudentBody,
  CreateStudentsResult,
  UpdateStudentBody,
} from './students.schema';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UserRole } from '@prisma/client';
import { parseCsv } from 'src/lib/csv';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  async createStudent({
    email,
    firstName,
    lastName,
    otherName,
    matricNumber,
    department,
    admissionYear,
    degree,
    gender,
    level,
  }: CreateStudentBody) {
    try {
      await this.prisma.user.create({
        data: {
          email,
          role: UserRole.STUDENT,
          student: {
            create: {
              firstName,
              lastName,
              otherName,
              matricNumber,
              department: { connect: { name: department } },
              admissionYear,
              degree,
              gender,
              level,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Email already exists');
        }
      }
    }
  }

  async createStudents(file: Express.Multer.File) {
    const content = file.buffer.toString('utf-8');
    const parsedData = await parseCsv(content, CreateStudentBody);
    const result: CreateStudentsResult = { students: [], ...parsedData };

    for (const row of parsedData.validRows) {
      try {
        await this.prisma.user.create({
          data: {
            email: row.email,
            role: UserRole.STUDENT,
            student: {
              create: {
                firstName: row.firstName,
                lastName: row.lastName,
                otherName: row.otherName,
                matricNumber: row.matricNumber,
                department: { connect: { name: row.department } },
                admissionYear: row.admissionYear,
                degree: row.degree,
                gender: row.gender,
                level: row.level,
              },
            },
          },
        });

        result.students.push({ ...row, isCreated: true });
      } catch (error) {
        result.students.push({ ...row, isCreated: false });
      }
    }

    return result;
  }

  async getStudents() {
    return await this.prisma.student.findMany({ where: { deletedAt: null } });
  }

  async updateStudent(
    studentId: string,
    {
      firstName,
      lastName,
      otherName,
      department,
      admissionYear,
      degree,
      gender,
      level,
    }: UpdateStudentBody,
  ) {
    try {
      await this.prisma.student.update({
        where: { id: studentId },
        data: {
          firstName,
          lastName,
          otherName,
          department: { connect: { name: department } },
          admissionYear,
          degree,
          gender,
          level,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new BadRequestException('Student not found');
        }
      }
    }
  }

  async deleteStudent(studentId: string) {
    try {
      await this.prisma.student.update({
        where: { id: studentId },
        data: {
          deletedAt: new Date(),
        },
      });
    } catch (error) {
      // TODO: Correct error handling
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Email already exists');
        }
      }
    }
  }
}
