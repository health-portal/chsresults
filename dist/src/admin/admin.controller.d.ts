import { AdminService } from './admin.service';
import { AddAdminBody } from './admin.schema';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    addAdmin(body: AddAdminBody): Promise<{
        id: string;
        name: string;
        email: string;
    }>;
    getProfile(adminId: string): Promise<{
        id: string;
        name: string;
        email: string;
    }>;
    updateProfile(adminId: string, name: string): Promise<{
        id: string;
        email: string;
        name: string;
    }>;
}
