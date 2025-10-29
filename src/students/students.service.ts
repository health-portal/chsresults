import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateStudentBody,
  CreateStudentsRes,
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
          throw new ConflictException('Email already exists');
        }
      }

      throw new BadRequestException(error);
    }
  }

  async createStudents(file: Express.Multer.File) {
    const content = file.buffer.toString('utf-8');
    const parsedData = await parseCsv(content, CreateStudentBody);
    const result: CreateStudentsRes = { students: [], ...parsedData };

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
      } catch {
        result.students.push({ ...row, isCreated: false });
      }
    }

    return result;
  }

  async getStudents() {
    const foundStudents = await this.prisma.student.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        otherName: true,
        matricNumber: true,
        admissionYear: true,
        degree: true,
        gender: true,
        level: true,
        status: true,
        department: { select: { name: true } },
        user: { select: { email: true } },
      },
      where: { deletedAt: null },
    });

    return foundStudents.map((student) => {
      return {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        otherName: student.otherName,
        matricNumber: student.matricNumber,
        admissionYear: student.admissionYear,
        degree: student.degree,
        gender: student.gender,
        level: student.level,
        status: student.status,
        department: student.department.name,
        email: student.user.email,
      };
    });
  }

  async getStudent(studentId: string) {
    const foundStudent = await this.prisma.student.findUnique({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        otherName: true,
        matricNumber: true,
        admissionYear: true,
        degree: true,
        gender: true,
        level: true,
        status: true,
        department: { select: { name: true } },
        user: { select: { email: true } },
      },
      where: { id: studentId, deletedAt: null },
    });

    if (!foundStudent) {
      throw new NotFoundException('Student not found');
    }

    return {
      id: foundStudent.id,
      firstName: foundStudent.firstName,
      lastName: foundStudent.lastName,
      otherName: foundStudent.otherName,
      matricNumber: foundStudent.matricNumber,
      admissionYear: foundStudent.admissionYear,
      degree: foundStudent.degree,
      gender: foundStudent.gender,
      level: foundStudent.level,
      status: foundStudent.status,
      department: foundStudent.department.name,
      email: foundStudent.user.email,
    };
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
          throw new NotFoundException('Student not found');
        }
      }

      throw new BadRequestException(error);
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
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Student not found');
        }
      }

      throw new BadRequestException(error);
    }
  }
}
