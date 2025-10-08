import { DatabaseService } from 'src/database/database.service';
import { CreateCourseBody, UpdateCourseBody, CreateCoursesResponse } from './courses.schema';
import { EmailQueueService } from 'src/email-queue/email-queue.service';
export declare class CoursesService {
    private readonly db;
    private readonly emailQueueService;
    constructor(db: DatabaseService, emailQueueService: EmailQueueService);
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
