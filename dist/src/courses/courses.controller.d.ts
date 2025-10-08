import { CoursesService } from './courses.service';
import { CreateCourseBody, CreateCoursesResponse, UpdateCourseBody } from './courses.schema';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    createCourse(body: CreateCourseBody): Promise<{
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
        code: string;
        title: string;
        description: string | null;
        units: number;
        semester: number;
        lecturer: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
        } | null;
        enrollmentCount: number;
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
        description: string | null;
        title: string;
        code: string;
        units: number;
        semester: number;
        lecturerId: string;
    }>;
}
