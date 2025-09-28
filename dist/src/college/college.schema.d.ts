import { faculty } from 'drizzle/schema';
export declare class UpsertFacultyAndDepartmentBody {
    name: string;
}
export declare class CreateDepartmentBody extends UpsertFacultyAndDepartmentBody {
    facultyId: string;
}
type Faculty = typeof faculty.$inferSelect;
export declare class FacultyResponse implements Faculty {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class DepartmentResponse extends FacultyResponse {
    facultyId: string;
}
export declare class GetDepartmentsResponse extends FacultyResponse {
    departments: DepartmentResponse[];
}
export {};
