import { DatabaseService } from 'src/database/database.service';
import { AddAdminBody } from './admin.schema';
export declare class AdminService {
    private readonly db;
    constructor(db: DatabaseService);
    addAdmin({ email, name, password }: AddAdminBody): Promise<{
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
