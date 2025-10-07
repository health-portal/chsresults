import { CollegeService } from './college.service';
import { CreateDepartmentBody, UpsertFacultyAndDepartmentBody } from './college.schema';
export declare class CollegeController {
    private readonly collegeService;
    constructor(collegeService: CollegeService);
    getDepartments(): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        departments: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            facultyId: string;
        }[];
    }[]>;
    createFaculty(body: UpsertFacultyAndDepartmentBody): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateFaculty(facultyId: string, body: UpsertFacultyAndDepartmentBody): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
    }>;
    deleteFaculty(facultyId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createDepartment(body: CreateDepartmentBody): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        facultyId: string;
    }>;
    updateDepartment(deptId: string, body: UpsertFacultyAndDepartmentBody): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        facultyId: string;
    }>;
    deleteDepartment(deptId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        facultyId: string;
    }>;
}
