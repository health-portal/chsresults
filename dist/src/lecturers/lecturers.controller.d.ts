import { LecturersService } from './lecturers.service';
import { CreateLecturerBody, CreateLecturersResponse, UpdateLecturerBody } from './lecturers.schema';
export declare class LecturersController {
    private readonly lecturersService;
    constructor(lecturersService: LecturersService);
    createLecturer(body: CreateLecturerBody): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        otherName: string | null;
        phone: string | null;
        departmentId: string;
    }>;
    createLecturers(file: Express.Multer.File): Promise<CreateLecturersResponse>;
    getLecturers(): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        otherName: string | null;
        phone: string | null;
        departmentId: string;
    }[]>;
    updateLecturer(lecturerId: string, body: UpdateLecturerBody): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        otherName: string | null;
        phone: string | null;
        departmentId: string;
    }>;
    deleteLecturer(lecturerId: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        otherName: string | null;
        phone: string | null;
        departmentId: string;
    }>;
}
