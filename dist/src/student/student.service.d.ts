import { DatabaseService } from 'src/database/database.service';
import { ChangePasswordBody } from './student.schema';
export declare class StudentService {
    private readonly db;
    constructor(db: DatabaseService);
    changePassword(studentId: string, { currentPassword, newPassword }: ChangePasswordBody): Promise<{
        success: boolean;
        message: string;
    }>;
    listEnrollments(studentId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        session: string;
        scores: unknown;
        courseId: string;
        studentId: string;
        student: {
            password: string | null;
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
                faculty: {
                    id: string;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                };
            };
        };
        course: {
            title: string;
            code: string;
            description: string | null;
            units: number;
            semester: number;
            lecturer: {
                password: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                phone: string | null;
                firstName: string;
                lastName: string;
                otherName: string | null;
                title: string;
                departmentId: string;
                department: {
                    id: string;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    facultyId: string;
                    faculty: {
                        id: string;
                        name: string;
                        createdAt: Date;
                        updatedAt: Date;
                    };
                };
            };
        };
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
