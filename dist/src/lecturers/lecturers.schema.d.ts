import { ParseCsvData } from 'src/utils/csv';
export declare class CreateLecturerBody {
    email: string;
    firstName: string;
    lastName: string;
    otherName?: string;
    phone?: string;
    department: string;
    title: string;
}
export declare class UpdateLecturerBody {
    email: string;
    firstName: string;
    lastName: string;
    otherName?: string;
    phone?: string;
    department: string;
    title?: string;
}
export declare class CreateLecturerResponse extends CreateLecturerBody {
    isCreated: boolean;
}
export declare class CreateLecturersResponse extends ParseCsvData<CreateLecturerBody> {
    lecturers: CreateLecturerResponse[];
}
