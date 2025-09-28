import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';
import { AuthUserBody, AuthStudentBody, StudentIdentifierBody } from './auth.schema';
import { EmailService } from 'src/email/email.service';
export declare class AuthService {
    private readonly db;
    private readonly jwtService;
    private readonly emailService;
    constructor(db: DatabaseService, jwtService: JwtService, emailService: EmailService);
    private generateAccessToken;
    private findAdmin;
    private updateAdminPassword;
    activateAdmin({ email, password }: AuthUserBody): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        phone: string | null;
        name: string;
    }>;
    signinAdmin({ email, password }: AuthUserBody): Promise<{
        accessToken: string;
    }>;
    adminResetPasswordRequest(email: string): Promise<{
        success: boolean;
        message: string;
    }>;
    adminResetPassword({ email, password }: AuthUserBody): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        phone: string | null;
        name: string;
    }>;
    private findLecturer;
    private updateLecturerPassword;
    activateLecturer({ email, password }: AuthUserBody): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        firstName: string;
        lastName: string;
        otherName: string | null;
        phone: string | null;
        title: string | null;
        departmentId: string;
    }>;
    signinLecturer({ email, password }: AuthUserBody): Promise<{
        accessToken: string;
    }>;
    lecturerResetPasswordRequest(email: string): Promise<{
        success: boolean;
        message: string;
    }>;
    lecturerResetPassword({ email, password }: AuthUserBody): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        firstName: string;
        lastName: string;
        otherName: string | null;
        phone: string | null;
        title: string | null;
        departmentId: string;
    }>;
    private findStudent;
    private updateStudentPassword;
    activateStudent({ studentIdentifier, identifierType, password, }: AuthStudentBody): Promise<{
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
    }>;
}
