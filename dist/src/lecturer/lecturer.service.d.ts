import { DatabaseService } from 'src/database/database.service';
import { BatchStudentRegistrationResponse, EditScoreBody, RegisterStudentBody, UploadScoresResponse } from './lecturer.schema';
export declare class LecturerService {
    private readonly db;
    constructor(db: DatabaseService);
    private validateCourseAccess;
    listCourses(lecturerId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        code: string;
        units: number;
        semester: number;
        lecturerId: string;
    }[]>;
    registerStudentsBatch(lecturerId: string, courseId: string, file: Express.Multer.File): Promise<BatchStudentRegistrationResponse>;
    registerStudent(lecturerId: string, courseId: string, { studentIdentifier, identifierType, session }: RegisterStudentBody): Promise<{
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
    }[]>;
    listCourseStudents(lecturerId: string, courseId: string): Promise<{
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
            firstName: string;
            lastName: string;
            otherName: string | null;
            departmentId: string;
            matricNumber: string;
            level: number;
            gender: string;
            degree: string;
        };
    }[]>;
    getProfile(lecturerId: string): Promise<{
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
    }>;
}
