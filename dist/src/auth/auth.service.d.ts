import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';
import { UserRole, AuthUserBody, AuthStudentBody, StudentIdentifierBody } from './auth.schema';
export declare class AuthService {
    private readonly db;
    private readonly jwtService;
    constructor(db: DatabaseService, jwtService: JwtService);
    private generateAccessToken;
    private findAdminOrLecturer;
    private findStudent;
    private updatePassword;
    activate(role: UserRole, { email, password }: AuthUserBody): Promise<{
        id: string;
        email: string;
        name: string;
    } | {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        otherName: string | null;
        phone: string | null;
        departmentId: string;
    } | {
        id: string;
        email: string;
        matricNumber: string;
        firstName: string;
        lastName: string;
        otherName: string | null;
        departmentId: string;
    }>;
    signin(role: UserRole, { email, password }: AuthUserBody): Promise<{
        accessToken: string;
    }>;
    resetPasswordRequest(role: UserRole, email: string): Promise<{
        success: boolean;
        message: string;
    }>;
    resetPassword(role: UserRole, { email, password }: AuthUserBody): Promise<{
        id: string;
        email: string;
        name: string;
    } | {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        otherName: string | null;
        phone: string | null;
        departmentId: string;
    } | {
        id: string;
        email: string;
        matricNumber: string;
        firstName: string;
        lastName: string;
        otherName: string | null;
        departmentId: string;
    }>;
    activateStudentAccount({ studentIdentifier, identifierType, password, }: AuthStudentBody): Promise<{
        id: string;
        email: string;
        name: string;
    } | {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        otherName: string | null;
        phone: string | null;
        departmentId: string;
    } | {
        id: string;
        email: string;
        matricNumber: string;
        firstName: string;
        lastName: string;
        otherName: string | null;
        departmentId: string;
    }>;
    signinStudent({ studentIdentifier, identifierType, password, }: AuthStudentBody): Promise<{
        accessToken: string;
    }>;
    studentResetPasswordRequest({ studentIdentifier, identifierType, }: StudentIdentifierBody): Promise<{
        success: boolean;
        message: string;
    }>;
    studentResetPassword({ studentIdentifier, identifierType, password, }: AuthStudentBody): Promise<{
        id: string;
        email: string;
        name: string;
    } | {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        otherName: string | null;
        phone: string | null;
        departmentId: string;
    } | {
        id: string;
        email: string;
        matricNumber: string;
        firstName: string;
        lastName: string;
        otherName: string | null;
        departmentId: string;
    }>;
}
