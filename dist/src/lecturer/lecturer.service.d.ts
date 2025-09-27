import { DatabaseService } from 'src/database/database.service';
import { BatchStudentRegistrationResponse, EditScoreBody, RegisterStudentBody, UploadScoresResponse } from './lecturer.schema';
export declare class LecturerService {
    private readonly db;
    constructor(db: DatabaseService);
    private validateCourseAccess;
    listCourses(lecturerId: string): Promise<{
        id: string;
        code: string;
        title: string;
        lecturerId: string;
    }[]>;
    registerStudentsBatch(lecturerId: string, courseId: string, file: Express.Multer.File): Promise<BatchStudentRegistrationResponse>;
    registerStudent(lecturerId: string, courseId: string, { studentIdentifier, identifierType }: RegisterStudentBody): Promise<{
        id: string;
        scores: unknown;
        courseId: string;
        studentId: string;
    }>;
    uploadScores(lecturerId: string, courseId: string, file: Express.Multer.File): Promise<UploadScoresResponse>;
    editScore(lecturerId: string, courseId: string, studentId: string, body: EditScoreBody): Promise<{
        id: string;
        scores: unknown;
        courseId: string;
        studentId: string;
    }>;
    viewCourseScores(lecturerId: string, courseId: string): Promise<{
        id: string;
        scores: unknown;
        courseId: string;
        studentId: string;
    }[]>;
    listCourseStudents(lecturerId: string, courseId: string): Promise<{
        id: string;
        scores: unknown;
        courseId: string;
        studentId: string;
    }[]>;
    getProfile(lecturerId: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        otherName: string | null;
        phone: string | null;
        departmentId: string;
    }>;
}
