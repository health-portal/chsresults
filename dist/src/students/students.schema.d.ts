import { Gender } from 'src/student/student.schema';
import { ParseCsvData } from 'src/utils/csv';
export declare class CreateStudentBody {
    email: string;
    matricNumber: string;
    firstName: string;
    lastName: string;
    otherName?: string;
    department: string;
    level: number;
    gender: Gender;
    degree: string;
}
export declare class UpdateStudentBody {
    firstName?: string;
    lastName?: string;
    otherName?: string;
    department?: string;
    level?: number;
    gender?: Gender;
    degree?: string;
}
export declare class CreateStudentResponse extends CreateStudentBody {
    isCreated: boolean;
}
export declare class CreateStudentsResponse extends ParseCsvData<CreateStudentBody> {
    students: CreateStudentResponse[];
}
