import { DatabaseService } from 'src/database/database.service';
import { AddAdminBody, UpdateAdminBody } from './admin.schema';
import { EmailQueueService } from 'src/email-queue/email-queue.service';
export declare class AdminService {
    private readonly db;
    private readonly emailQueueService;
    constructor(db: DatabaseService, emailQueueService: EmailQueueService);
    addAdmin({ email, name }: AddAdminBody): Promise<{
        email: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
    }>;
    getProfile(adminId: string): Promise<{
        email: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
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
