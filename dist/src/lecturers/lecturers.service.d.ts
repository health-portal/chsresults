import { DatabaseService } from 'src/database/database.service';
import { CreateLecturerBody, CreateLecturersResponse, UpdateLecturerBody } from './lecturers.schema';
import { JwtService } from '@nestjs/jwt';
import { EmailQueueService } from 'src/email-queue/email-queue.service';
export declare class LecturersService {
    private readonly db;
    private readonly jwtService;
    private readonly emailQueueService;
    constructor(db: DatabaseService, jwtService: JwtService, emailQueueService: EmailQueueService);
    private generateToken;
    inviteLecturer(id: string, email: string, name: string): Promise<void>;
    createLecturer(body: CreateLecturerBody): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        firstName: string;
        lastName: string;
        otherName: string | null;
        title: string;
        departmentId: string;
    }>;
    createLecturers(file: Express.Multer.File): Promise<CreateLecturersResponse>;
    getLecturers(): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        firstName: string;
        lastName: string;
        otherName: string | null;
        title: string;
        departmentId: string;
    }[]>;
    updateLecturer(lecturerId: string, body: UpdateLecturerBody): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        firstName: string;
        lastName: string;
        otherName: string | null;
        phone: string | null;
        title: string;
        departmentId: string;
    }>;
    deleteLecturer(lecturerId: string): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        firstName: string;
        lastName: string;
        otherName: string | null;
        title: string;
        departmentId: string;
    }>;
}
