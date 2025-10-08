import { StudentService } from './student.service';
import { ChangePasswordBody } from './student.schema';
export declare class StudentController {
    private readonly studentService;
    constructor(studentService: StudentService);
    changePassword(studentId: string, body: ChangePasswordBody): Promise<{
        success: boolean;
        message: string;
    }>;
    listEnrollments(studentId: string): Promise<{
        session: string;
        course: {
            id: string;
            code: string;
            title: string;
            units: number;
            semester: number;
        };
        department: {
            id: string;
            name: string;
        };
        faculty: {
            id: string;
            name: string;
        };
        enrollmentId: string;
        scores: unknown;
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
