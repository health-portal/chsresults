import { CoursesService } from './courses.service';
import { CreateCourseBody, CreateCoursesResponse, UpdateCourseBody } from './courses.schema';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    createCourse(body: CreateCourseBody): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
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
        title: string;
        description: string | null;
        code: string;
        units: number;
        semester: number;
        lecturerId: string;
    }[]>;
    updateCourse(courseId: string, body: UpdateCourseBody): Promise<{
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
        description: string | null;
        code: string;
        units: number;
        semester: number;
        lecturerId: string;
    }>;
}
