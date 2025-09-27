import { StudentService } from './student.service';
export declare class StudentController {
    private readonly studentService;
    constructor(studentService: StudentService);
    listEnrollments(studentId: string): Promise<{
        id: string;
        scores: unknown;
        courseId: string;
        studentId: string;
    }[]>;
    listEnrollment(studentId: string, enrollmentId: string): Promise<{
        id: string;
        scores: unknown;
        courseId: string;
        studentId: string;
    }>;
    getProfile(studentId: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        otherName: string | null;
        departmentId: string;
        matricNumber: string;
    }>;
}
