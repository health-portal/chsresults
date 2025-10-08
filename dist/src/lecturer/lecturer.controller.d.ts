import { LecturerService } from './lecturer.service';
import { BatchStudentRegistrationResponse, EditScoreBody, RegisterStudentBody, UploadScoresResponse } from './lecturer.schema';
export declare class LecturerController {
    private readonly lecturerService;
    constructor(lecturerService: LecturerService);
    listCourses(lecturerId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        code: string;
        units: number;
        semester: number;
        lecturerId: string;
    }[]>;
    registerStudentsBatch(lecturerId: string, courseId: string, file: Express.Multer.File): Promise<BatchStudentRegistrationResponse>;
    registerStudent(lecturerId: string, courseId: string, body: RegisterStudentBody): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        session: string;
        scores: unknown;
        courseId: string;
        studentId: string;
    }>;
    uploadScores(lecturerId: string, courseId: string, file: Express.Multer.File): Promise<UploadScoresResponse>;
    editScore(lecturerId: string, courseId: string, studentId: string, body: EditScoreBody): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        session: string;
        scores: unknown;
        courseId: string;
        studentId: string;
    }>;
    viewCourseScores(lecturerId: string, courseId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        session: string;
        scores: unknown;
        courseId: string;
        studentId: string;
        student: {
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
            department: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                facultyId: string;
            };
        };
    }[]>;
    listCourseStudents(lecturerId: string, courseId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        session: string;
        courseId: string;
        studentId: string;
        student: {
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
            department: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                facultyId: string;
            };
        };
    }[]>;
    getProfile(lecturerId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        firstName: string;
        lastName: string;
        otherName: string | null;
        departmentId: string;
        title: string;
        phone: string | null;
    }>;
}
