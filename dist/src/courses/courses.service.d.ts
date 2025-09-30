import { DatabaseService } from 'src/database/database.service';
import { CreateCourseBody, UpdateCourseBody, CreateCoursesResponse } from './courses.schema';
export declare class CoursesService {
    private readonly db;
    constructor(db: DatabaseService);
    createCourse({ code, title, lecturerEmail, semester, units, }: CreateCourseBody): Promise<{
        code: string;
        title: string;
        description: string | null;
        units: number;
        semester: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        lecturerId: string;
    }>;
    createCourses(file: Express.Multer.File): Promise<CreateCoursesResponse>;
    getCourses(): Promise<{
        code: string;
        title: string;
        description: string | null;
        units: number;
        semester: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        lecturerId: string;
        lecturer: {
            title: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            firstName: string;
            lastName: string;
            otherName: string | null;
            phone: string | null;
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
        code: string;
        title: string;
        description: string | null;
        units: number;
        semester: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        lecturerId: string;
    }>;
}
