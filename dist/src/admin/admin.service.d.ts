import { DatabaseService } from 'src/database/database.service';
import { AddAdminBody, UpdateAdminBody } from './admin.schema';
import { EmailService } from 'src/email/email.service';
export declare class AdminService {
    private readonly db;
    private readonly emailService;
    constructor(db: DatabaseService, emailService: EmailService);
    addAdmin({ email, name }: AddAdminBody): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        phone: string | null;
    }>;
    getProfile(adminId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        phone: string | null;
    }>;
    updateProfile(adminId: string, { name, phone }: UpdateAdminBody): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        phone: string | null;
        name: string;
    }>;
}
