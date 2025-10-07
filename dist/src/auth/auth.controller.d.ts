import { AuthService } from './auth.service';
import { SigninUserBody, SigninStudentBody, StudentIdentifierBody, VerifyUserBody, VerifyStudentBody } from './auth.schema';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    activateAdmin(body: VerifyUserBody): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        phone: string | null;
        name: string;
    }>;
    signinAdmin(body: SigninUserBody): Promise<{
        accessToken: string;
    }>;
    adminResetPasswordRequest(email: string): Promise<{
        success: boolean;
        message: string;
    }>;
    adminResetPassword(body: VerifyUserBody): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        phone: string | null;
        name: string;
    }>;
    activateLecturer(body: VerifyUserBody): Promise<{
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
    signinLecturer(body: SigninUserBody): Promise<{
        accessToken: string;
    }>;
    lecturerResetPasswordRequest(email: string): Promise<{
        success: boolean;
        message: string;
    }>;
    lecturerResetPassword(body: VerifyUserBody): Promise<{
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
    activateStudent(body: VerifyStudentBody): Promise<{
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
    signinStudent(body: SigninStudentBody): Promise<{
        accessToken: string;
    }>;
    studentResetPasswordRequest(body: StudentIdentifierBody): Promise<{
        success: boolean;
        message: string;
    }>;
    studentResetPassword(body: VerifyStudentBody): Promise<{
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
