import { CoursesService } from './courses.service';
import { CreateCourseBody, CreateCoursesResponse, UpdateCourseBody } from './courses.schema';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    createCourse(body: CreateCourseBody): Promise<{
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
