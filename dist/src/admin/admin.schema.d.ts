import { admin } from 'drizzle/schema';
export declare class AddAdminBody {
    email: string;
    name: string;
}
export declare class UpdateAdminBody {
    name?: string;
    phone?: string;
}
type Admin = Omit<typeof admin.$inferSelect, 'password'>;
export declare class AdminProfileResponse implements Admin {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    email: string;
    phone: string | null;
    status: boolean;
}
export {};
