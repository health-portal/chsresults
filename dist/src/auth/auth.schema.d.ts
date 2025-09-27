export declare enum UserRole {
    ADMIN = "Admin",
    LECTURER = "Lecturer",
    STUDENT = "Student"
}
export interface JwtPayload {
    id: string;
    role: UserRole;
}
export declare class AuthUserBody {
    email: string;
    password: string;
}
export declare enum StudentIdentifierType {
    EMAIL = "email",
    MATRIC_NUMBER = "matricNumber"
}
export declare class StudentIdentifierBody {
    studentIdentifier: string;
    identifierType: StudentIdentifierType;
}
export declare class AuthStudentBody extends StudentIdentifierBody {
    password: string;
}
export declare class SigninResponse {
    accessToken: string;
}
export declare class AdminProfileResponse {
    id: string;
    name: string;
    email: string;
}
export declare class LecturerProfileResponse {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    otherName?: string;
    phone?: string;
    departmentId: string;
}
export declare class StudentProfileResponse {
    email: string;
    matricNumber: string;
    id: string;
    firstName: string;
    lastName: string;
    otherName?: string;
    departmentId: string;
}
