import { CollegeService } from './college.service';
import { CreateDepartmentBody, UpsertFacultyAndDepartmentBody } from './college.schema';
export declare class CollegeController {
    private readonly collegeService;
    constructor(collegeService: CollegeService);
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
    createDepartment(body: CreateDepartmentBody): Promise<{
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
