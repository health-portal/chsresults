import { AuthService } from './auth.service';
import { AuthUserBody, AuthStudentBody, StudentIdentifierBody } from './auth.schema';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    activateAdminAccount(body: AuthUserBody): Promise<{
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
    signinAdmin(body: AuthUserBody): Promise<{
        accessToken: string;
    }>;
    adminResetPasswordRequest(email: string): Promise<{
        success: boolean;
        message: string;
    }>;
    adminResetPassword(body: AuthUserBody): Promise<{
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
    activateLecturerAccount(body: AuthUserBody): Promise<{
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
    signinLecturer(body: AuthUserBody): Promise<{
        accessToken: string;
    }>;
    lecturerResetPasswordRequest(email: string): Promise<{
        success: boolean;
        message: string;
    }>;
    lecturerResetPassword(body: AuthUserBody): Promise<{
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
    activateStudentAccount(body: AuthStudentBody): Promise<{
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
    signinStudent(body: AuthStudentBody): Promise<{
        accessToken: string;
    }>;
    studentResetPasswordRequest(body: StudentIdentifierBody): Promise<{
        success: boolean;
        message: string;
    }>;
    studentResetPassword(body: AuthStudentBody): Promise<{
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
