import { AdminService } from './admin.service';
import { AddAdminBody, UpdateAdminBody } from './admin.schema';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    addAdmin(body: AddAdminBody): Promise<{
        name: string;
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
    }>;
    getAdmins(): Promise<{
        name: string;
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
    }[]>;
    getProfile(adminId: string): Promise<{
        name: string;
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
    }>;
    updateProfile(adminId: string, body: UpdateAdminBody): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        phone: string | null;
        name: string;
    }>;
}
