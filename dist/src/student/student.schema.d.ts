import { student } from 'drizzle/schema';
import { DepartmentResponse } from 'src/college/college.schema';
export declare enum Gender {
    MALE = "male",
    FEMALE = "female"
}
type Student = Omit<typeof student.$inferSelect, 'password'>;
export declare class StudentProfileResponse implements Student {
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
    department?: DepartmentResponse;
}
export {};
