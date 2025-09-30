import { course, enrollment } from 'drizzle/schema';
import { LecturerProfileResponse } from 'src/lecturer/lecturer.schema';
import { StudentProfileResponse } from 'src/student/student.schema';
import { ParseCsvData } from 'src/utils/csv';
export declare class CreateCourseBody {
    code: string;
    title: string;
    lecturerEmail: string;
    description?: string;
    units: number;
    semester: number;
}
export declare class UpdateCourseBody {
    code?: string;
    title?: string;
    lecturerEmail: string;
    description?: string;
    units?: number;
    semester: number;
}
export declare class CreateCourseResponse extends CreateCourseBody {
    isCreated: boolean;
}
export declare class CreateCoursesResponse extends ParseCsvData<CreateCourseBody> {
    courses: CreateCourseResponse[];
}
type Course = typeof course.$inferSelect;
export declare class CourseResponse implements Course {
    description: string | null;
    title: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    code: string;
    units: number;
    semester: number;
    lecturerId: string;
    lecturer: LecturerProfileResponse;
}
type Enrollment = typeof enrollment.$inferSelect;
export declare class EnrollmentResponse implements Enrollment {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    session: string;
    scores: unknown;
    courseId: string;
    studentId: string;
    student: StudentProfileResponse;
}
export {};
