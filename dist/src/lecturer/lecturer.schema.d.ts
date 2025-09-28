import { type StudentIdentifierType } from 'src/auth/auth.schema';
import { ParseCsvData } from 'src/utils/csv';
export declare class RegisterStudentBody {
    studentIdentifier: string;
    identifierType: StudentIdentifierType;
    session: string;
}
export declare class Scores {
    continuousAssessment: number;
    examination: number;
}
export declare class EditScoreBody extends Scores {
}
export declare class RegisterStudentRow {
    matricNumber: string;
    name: string;
    session: string;
}
export declare class UploadScoreRow extends Scores {
    matricNumber: string;
}
export declare class BatchStudentRegistrationResponse extends ParseCsvData<RegisterStudentRow> {
    registeredStudents: string[];
    unregisteredStudents: string[];
}
export declare class UploadScoresResponse extends ParseCsvData<UploadScoreRow> {
    studentsUploadedFor: string[];
    studentsNotFound: string[];
}
export declare class LecturerProfileResponse {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    firstName: string;
    lastName: string;
    otherName?: string;
    phone?: string;
    departmentId: string;
}
