import { CoursesService } from './courses.service';
import { CreateCoursesResponse, UpsertCourseBody } from './courses.schema';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    createCourse(body: UpsertCourseBody): Promise<{
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
    updateCourse(courseId: string, body: UpsertCourseBody): Promise<{
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
