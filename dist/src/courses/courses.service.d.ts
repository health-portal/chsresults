import { DatabaseService } from 'src/database/database.service';
import { CreateCourseBody, UpdateCourseBody, CreateCoursesResponse } from './courses.schema';
export declare class CoursesService {
    private readonly db;
    constructor(db: DatabaseService);
    createCourse({ code, title, lecturerEmail, semester, units, }: CreateCourseBody): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        code: string;
        description: string | null;
        units: number;
        semester: number;
        lecturerId: string;
    }>;
    createCourses(file: Express.Multer.File): Promise<CreateCoursesResponse>;
    getCourses(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        code: string;
        description: string | null;
        units: number;
        semester: number;
        lecturerId: string;
        lecturer: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            phone: string | null;
            firstName: string;
            lastName: string;
            otherName: string | null;
            title: string;
            departmentId: string;
        };
    }[]>;
    updateCourse(courseId: string, { code, title, lecturerEmail, description, semester, units, }: UpdateCourseBody): Promise<{
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
        title: string;
        code: string;
        description: string | null;
        units: number;
        semester: number;
        lecturerId: string;
    }>;
}
