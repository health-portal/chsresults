import { UpsertFacultyAndDepartmentBody, CreateDepartmentBody } from './college.schema';
import { DatabaseService } from 'src/database/database.service';
export declare class CollegeService {
    private readonly db;
    constructor(db: DatabaseService);
    getDepartments(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        departments: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            facultyId: string;
        }[];
    }[]>;
    createFaculty(body: UpsertFacultyAndDepartmentBody): Promise<{
        id: string;
        name: string;
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
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createDepartment({ facultyId, name }: CreateDepartmentBody): Promise<{
        id: string;
        name: string;
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
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        facultyId: string;
    }>;
}
