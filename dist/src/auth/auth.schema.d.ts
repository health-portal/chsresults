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
