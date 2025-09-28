import { LecturersService } from './lecturers.service';
import { CreateLecturerBody, CreateLecturersResponse, UpdateLecturerBody } from './lecturers.schema';
export declare class LecturersController {
    private readonly lecturersService;
    constructor(lecturersService: LecturersService);
    createLecturer(body: CreateLecturerBody): Promise<{
        email: string;
        firstName: string;
        lastName: string;
        title: string | null;
        otherName: string | null;
        phone: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        departmentId: string;
    }>;
    createLecturers(file: Express.Multer.File): Promise<CreateLecturersResponse>;
    getLecturers(): Promise<{
        email: string;
        firstName: string;
        lastName: string;
        title: string | null;
        otherName: string | null;
        phone: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
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
        title: string | null;
        departmentId: string;
    }>;
    deleteLecturer(lecturerId: string): Promise<{
        email: string;
        firstName: string;
        lastName: string;
        title: string | null;
        otherName: string | null;
        phone: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        departmentId: string;
    }>;
}
