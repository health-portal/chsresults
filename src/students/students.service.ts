import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import {
  CreateStudentBody,
  CreateStudentsResponse,
  UpdateStudentBody,
} from './students.schema';
import { department, student, token } from 'drizzle/schema';
import { eq, or } from 'drizzle-orm';
import { parseCsvFile } from 'src/utils/csv';
import { EmailQueueService } from 'src/email-queue/email-queue.service';
import { JwtPayload, TokenType, UserRole } from 'src/auth/auth.schema';
import { JwtService } from '@nestjs/jwt';
import { InvitationTemplate } from 'src/email-queue/email-queue.schema';
import { env } from 'src/environment';

@Injectable()
export class StudentsService {
  constructor(
    private readonly db: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly emailQueueService: EmailQueueService,
  ) {}

  private async generateToken(payload: JwtPayload, expiresIn: string = '1d') {
    const token = await this.jwtService.signAsync(payload, { expiresIn });
    return token;
  }

  async inviteStudent(id: string, email: string, name: string) {
    const tokenString = await this.generateToken(
      { id, role: UserRole.STUDENT },
      '7d',
    );

    await this.db.client
      .insert(token)
      .values({
        userId: id,
        userRole: UserRole.ADMIN,
        tokenString,
        tokenType: TokenType.ACTIVATE_ACCOUNT,
      })
      .onConflictDoUpdate({
        target: [token.userId, token.userRole],
        set: { tokenString, tokenType: TokenType.ACTIVATE_ACCOUNT },
      });

    await this.emailQueueService.send({
      subject: 'Invitation to Activate Account',
      toEmail: email,
      htmlContent: InvitationTemplate({
        name,
        registrationLink: `${env.FRONTEND_BASE_URL}/student/activate/?token=${tokenString}`,
      }),
    });
  }

  async createStudent(body: CreateStudentBody) {
    const foundStudent = await this.db.client.query.student.findFirst({
      where: or(
        eq(student.matricNumber, body.matricNumber),
        eq(student.email, body.email),
      ),
    });
    if (foundStudent)
      throw new BadRequestException('Student already registered');

    const foundDepartment = await this.db.client.query.department.findFirst({
      where: eq(department.name, body.department),
    });
    if (!foundDepartment) throw new BadRequestException('Department not found');

    const [insertedStudent] = await this.db.client
      .insert(student)
      .values({ ...body, departmentId: foundDepartment.id })
      .returning();

    await this.inviteStudent(
      insertedStudent.id,
      insertedStudent.email,
      `${insertedStudent.firstName} ${insertedStudent.lastName}`,
    );

    const { password: _, ...studentProfile } = insertedStudent;
    return studentProfile;
  }

  async createStudents(file: Express.Multer.File) {
    const parsedData = await parseCsvFile(file, CreateStudentBody);
    const result: CreateStudentsResponse = { students: [], ...parsedData };

    await this.db.client.transaction(async (tx) => {
      for (const row of parsedData.validRows) {
        const foundDepartment = await tx.query.department.findFirst({
          where: eq(department.name, row.department),
        });
        if (!foundDepartment)
          result.students.push({ ...row, isCreated: false });
        else {
          const [insertedStudent] = await tx
            .insert(student)
            .values({ ...row, departmentId: foundDepartment.id })
            .returning()
            .onConflictDoNothing();

          if (insertedStudent) {
            await this.inviteStudent(
              insertedStudent.id,
              insertedStudent.email,
              `${insertedStudent.firstName} ${insertedStudent.lastName}`,
            );

            result.students.push({ ...row, isCreated: true });
          } else result.students.push({ ...row, isCreated: false });
        }
      }
    });

    return result;
  }

  async getStudents() {
    const foundStudents = await this.db.client.query.student.findMany();
    return foundStudents.map((s) => {
      const { password: _, ...studentProfile } = s;
      return studentProfile;
    });
  }

  async updateStudent(studentId: string, body: UpdateStudentBody) {
    const foundStudent = await this.db.client.query.student.findFirst({
      where: eq(student.id, studentId),
    });
    if (!foundStudent) throw new NotFoundException('Student not found');

    let departmentId: string | undefined = foundStudent.departmentId;
    if (body.department) {
      const foundDepartment = await this.db.client.query.department.findFirst({
        where: eq(department.name, body.department),
      });
      if (!foundDepartment)
        throw new BadRequestException('Department not found');
      departmentId = foundDepartment.id;
    }

    const [updatedStudent] = await this.db.client
      .update(student)
      .set({ ...body, departmentId })
      .where(eq(student.id, studentId))
      .returning();

    const { password: _, ...studentProfile } = updatedStudent;
    return studentProfile;
  }

  async deleteStudent(studentId: string) {
    const foundStudent = await this.db.client.query.student.findFirst({
      where: eq(student.id, studentId),
    });
    if (!foundStudent) throw new NotFoundException('Student not found');

    const [deleteStudent] = await this.db.client
      .delete(student)
      .where(eq(student.id, studentId))
      .returning();

    const { password: _, ...studentProfile } = deleteStudent;
    return studentProfile;
  }
}
