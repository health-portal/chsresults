import { DatabaseService } from 'src/database/database.service';
import { UpsertCourseBody, CreateCoursesResponse } from './courses.schema';
export declare class CoursesService {
    private readonly db;
    constructor(db: DatabaseService);
    createCourse({ code, title, lecturerEmail }: UpsertCourseBody): Promise<{
        id: string;
        code: string;
        title: string;
        lecturerId: string;
    }>;
    createCourses(file: Express.Multer.File): Promise<CreateCoursesResponse>;
    getCourses(): Promise<{
        id: string;
        code: string;
        title: string;
        lecturerId: string;
    }[]>;
    updateCourse(courseId: string, { code, title, lecturerEmail }: UpsertCourseBody): Promise<{
        id: string;
        code: string;
        title: string;
        lecturerId: string;
    }>;
    deleteCourse(courseId: string): Promise<{
        id: string;
        code: string;
        title: string;
        lecturerId: string;
    }>;
}
