import { UpsertFacultyAndDepartmentBody, CreateDepartmentBody } from './college.schema';
export declare class CollegeService {
    getDepartments(): Promise<{
        id: string;
        name: string;
        departments: {
            id: string;
            name: string;
            facultyId: string;
        }[];
    }[]>;
    createFaculty(body: UpsertFacultyAndDepartmentBody): Promise<{
        id: string;
        name: string;
    }>;
    updateFaculty(facultyId: string, body: UpsertFacultyAndDepartmentBody): Promise<{
        id: string;
        name: string;
    }>;
    deleteFaculty(facultyId: string): Promise<{
        id: string;
        name: string;
    }>;
    createDepartment({ facultyId, name }: CreateDepartmentBody): Promise<{
        id: string;
        name: string;
        facultyId: string;
    }>;
    updateDepartment(deptId: string, body: UpsertFacultyAndDepartmentBody): Promise<{
        id: string;
        name: string;
        facultyId: string;
    }>;
    deleteDepartment(deptId: string): Promise<{
        id: string;
        name: string;
        facultyId: string;
    }>;
}
