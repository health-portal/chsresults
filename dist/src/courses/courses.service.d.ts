import { DatabaseService } from 'src/database/database.service';
import { UpsertCourseBody, CreateCoursesResponse } from './courses.schema';
export declare class CoursesService {
    private readonly db;
    constructor(db: DatabaseService);
    createCourse({ code, title, lecturerEmail, semester, units, }: UpsertCourseBody): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        code: string;
        units: number;
        semester: number;
        lecturerId: string;
    }>;
    createCourses(file: Express.Multer.File): Promise<CreateCoursesResponse>;
    getCourses(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        code: string;
        units: number;
        semester: number;
        lecturerId: string;
    }[]>;
    updateCourse(courseId: string, { code, title, lecturerEmail, description, semester, units, }: UpsertCourseBody): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        title: string;
        description: string | null;
        units: number;
        semester: number;
        lecturerId: string;
    }>;
    deleteCourse(courseId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        code: string;
        units: number;
        semester: number;
        lecturerId: string;
    }>;
}
