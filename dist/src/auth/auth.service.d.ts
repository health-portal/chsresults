import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';
import { SigninUserBody, SigninStudentBody, StudentIdentifierBody, VerifyUserBody, VerifyStudentBody } from './auth.schema';
import { EmailQueueService } from 'src/email-queue/email-queue.service';
export declare class AuthService {
    private readonly db;
    private readonly jwtService;
    private readonly emailQueueService;
    constructor(db: DatabaseService, jwtService: JwtService, emailQueueService: EmailQueueService);
    private generateToken;
    private findAdmin;
    private updateAdminPassword;
    activateAdmin({ email, password, tokenString }: VerifyUserBody): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        phone: string | null;
        name: string;
    }>;
    signinAdmin({ email, password }: SigninUserBody): Promise<{
        accessToken: string;
    }>;
    adminResetPasswordRequest(email: string): Promise<{
        success: boolean;
        message: string;
    }>;
    adminResetPassword({ email, password, tokenString }: VerifyUserBody): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        phone: string | null;
        name: string;
    }>;
    private findLecturer;
    private updateLecturerPassword;
    activateLecturer({ email, password, tokenString }: VerifyUserBody): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        firstName: string;
        lastName: string;
        otherName: string | null;
        phone: string | null;
        title: string;
        departmentId: string;
    }>;
    signinLecturer({ email, password }: SigninUserBody): Promise<{
        accessToken: string;
    }>;
    lecturerResetPasswordRequest(email: string): Promise<{
        success: boolean;
        message: string;
    }>;
    lecturerResetPassword({ email, password, tokenString, }: VerifyUserBody): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        firstName: string;
        lastName: string;
        otherName: string | null;
        phone: string | null;
        title: string;
        departmentId: string;
    }>;
    private findStudent;
    private updateStudentPassword;
    activateStudent({ studentIdentifier, identifierType, password, tokenString, }: VerifyStudentBody): Promise<{
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
    signinStudent({ studentIdentifier, identifierType, password, }: SigninStudentBody): Promise<{
        accessToken: string;
    }>;
    studentResetPasswordRequest({ studentIdentifier, identifierType, }: StudentIdentifierBody): Promise<{
        success: boolean;
        message: string;
    }>;
    studentResetPassword({ studentIdentifier, identifierType, password, tokenString, }: VerifyStudentBody): Promise<{
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
