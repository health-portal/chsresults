import { DatabaseService } from 'src/database/database.service';
import { CreateStudentBody, CreateStudentsResponse, UpdateStudentBody } from './students.schema';
export declare class StudentsService {
    private readonly db;
    constructor(db: DatabaseService);
    createStudent(body: CreateStudentBody): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        otherName: string | null;
        departmentId: string;
        matricNumber: string;
    }>;
    createStudents(file: Express.Multer.File): Promise<CreateStudentsResponse>;
    getStudents(): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        otherName: string | null;
        departmentId: string;
        matricNumber: string;
    }[]>;
    updateStudent(studentId: string, body: UpdateStudentBody): Promise<{
        id: string;
        email: string;
        matricNumber: string;
        firstName: string;
        lastName: string;
        otherName: string | null;
        departmentId: string;
    }>;
    deleteStudent(studentId: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        otherName: string | null;
        departmentId: string;
        matricNumber: string;
    }>;
}
