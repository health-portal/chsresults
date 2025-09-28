import { ParseCsvData } from 'src/utils/csv';
export declare class CreateLecturerBody {
    email: string;
    firstName: string;
    lastName: string;
    otherName?: string;
    phone?: string;
    department: string;
    title?: string;
}
declare const UpdateLecturerBody_base: import("@nestjs/mapped-types").MappedType<Omit<Partial<CreateLecturerBody>, "email">>;
export declare class UpdateLecturerBody extends UpdateLecturerBody_base {
}
export declare class CreateLecturerResponse extends CreateLecturerBody {
    isCreated: boolean;
}
export declare class CreateLecturersResponse extends ParseCsvData<CreateLecturerBody> {
    lecturers: CreateLecturerResponse[];
}
export {};
