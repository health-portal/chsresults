import { DatabaseService } from 'src/database/database.service';
export declare class StudentService {
    private readonly db;
    constructor(db: DatabaseService);
    listEnrollments(studentId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        session: string;
        scores: unknown;
        courseId: string;
        studentId: string;
    }[]>;
    listEnrollment(studentId: string, enrollmentId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        session: string;
        scores: unknown;
        courseId: string;
        studentId: string;
    }>;
    getProfile(studentId: string): Promise<{
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
        department: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            facultyId: string;
        };
    }>;
}
