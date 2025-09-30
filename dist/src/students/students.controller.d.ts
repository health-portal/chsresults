import { StudentsService } from './students.service';
import { CreateStudentBody, CreateStudentsResponse, UpdateStudentBody } from './students.schema';
export declare class StudentsController {
    private readonly studentsService;
    constructor(studentsService: StudentsService);
    createStudent(body: CreateStudentBody): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
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
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
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
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
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
