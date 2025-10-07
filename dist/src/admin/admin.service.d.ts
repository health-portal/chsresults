import { DatabaseService } from 'src/database/database.service';
import { AddAdminBody, UpdateAdminBody } from './admin.schema';
import { EmailQueueService } from 'src/email-queue/email-queue.service';
import { JwtService } from '@nestjs/jwt';
export declare class AdminService {
    private readonly db;
    private readonly jwtService;
    private readonly emailQueueService;
    constructor(db: DatabaseService, jwtService: JwtService, emailQueueService: EmailQueueService);
    private generateToken;
    addAdmin({ email, name }: AddAdminBody): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        phone: string | null;
    }>;
    getAdmins(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        phone: string | null;
    }[]>;
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
