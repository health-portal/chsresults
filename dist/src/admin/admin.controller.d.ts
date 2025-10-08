import { AdminService } from './admin.service';
import { AddAdminBody, UpdateAdminBody } from './admin.schema';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    addAdmin(body: AddAdminBody): Promise<{
        status: boolean;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        phone: string | null;
    }>;
    getAdmins(): Promise<{
        status: boolean;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        phone: string | null;
    }[]>;
    getProfile(adminId: string): Promise<{
        status: boolean;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        phone: string | null;
    }>;
    updateProfile(adminId: string, body: UpdateAdminBody): Promise<{
        status: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        phone: string | null;
        name: string;
    }>;
}
