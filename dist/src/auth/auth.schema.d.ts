export declare enum UserRole {
    ADMIN = "Admin",
    LECTURER = "Lecturer",
    STUDENT = "Student"
}
export declare enum TokenType {
    ACTIVATE_ACCOUNT = "activate_account",
    RESET_PASSWORD = "reset_password"
}
export interface JwtPayload {
    id: string;
    role: UserRole;
}
export declare class VerifyUserBody {
    email: string;
    password: string;
    tokenString: string;
}
export declare class SigninUserBody {
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
export declare class SigninStudentBody extends StudentIdentifierBody {
    password: string;
}
export declare class VerifyStudentBody extends SigninStudentBody {
    tokenString: string;
}
export declare class SigninResponse {
    accessToken: string;
}
