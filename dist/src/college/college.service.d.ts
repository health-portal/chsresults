import { UpsertFacultyAndDepartmentBody, CreateDepartmentBody } from './college.schema';
import { DatabaseService } from 'src/database/database.service';
export declare class CollegeService {
    private readonly db;
    constructor(db: DatabaseService);
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
    createDepartment({ facultyId, name }: CreateDepartmentBody): Promise<{
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
