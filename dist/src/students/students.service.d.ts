import { DatabaseService } from 'src/database/database.service';
import { CreateStudentBody, CreateStudentsResponse, UpdateStudentBody } from './students.schema';
import { EmailQueueService } from 'src/email-queue/email-queue.service';
import { JwtService } from '@nestjs/jwt';
export declare class StudentsService {
    private readonly db;
    private readonly jwtService;
    private readonly emailQueueService;
    constructor(db: DatabaseService, jwtService: JwtService, emailQueueService: EmailQueueService);
    private generateToken;
    inviteStudent(id: string, email: string, name: string): Promise<void>;
    createStudent(body: CreateStudentBody): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        firstName: string;
        lastName: string;
        otherName: string | null;
        departmentId: string;
        matricNumber: string;
        level: number;
        gender: string;
        degree: string;
    }>;
    createStudents(file: Express.Multer.File): Promise<CreateStudentsResponse>;
    getStudents(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        firstName: string;
        lastName: string;
        otherName: string | null;
        departmentId: string;
        matricNumber: string;
        level: number;
        gender: string;
        degree: string;
    }[]>;
    updateStudent(studentId: string, body: UpdateStudentBody): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        matricNumber: string;
        firstName: string;
        lastName: string;
        otherName: string | null;
        level: number;
        gender: string;
        degree: string;
        departmentId: string;
    }>;
    deleteStudent(studentId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        firstName: string;
        lastName: string;
        otherName: string | null;
        departmentId: string;
        matricNumber: string;
        level: number;
        gender: string;
        degree: string;
    }>;
}
