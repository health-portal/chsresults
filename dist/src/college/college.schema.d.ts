export declare class UpsertFacultyAndDepartmentBody {
    name: string;
}
export declare class CreateDepartmentBody extends UpsertFacultyAndDepartmentBody {
    facultyId: string;
}
export declare class FacultyResponse {
    id: string;
    name: string;
}
export declare class DepartmentResponse extends FacultyResponse {
    facultyId: string;
}
export declare class GetDepartmentsResponse extends FacultyResponse {
    departments: DepartmentResponse[];
}
