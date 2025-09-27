import { Scores } from 'src/lecturer/lecturer.schema';
import { ParseCsvData } from 'src/utils/csv';
export declare class UpsertCourseBody {
    code: string;
    title: string;
    lecturerEmail: string;
}
export declare class CreateCourseResponse extends UpsertCourseBody {
    isCreated: boolean;
}
export declare class CreateCoursesResponse extends ParseCsvData<UpsertCourseBody> {
    courses: CreateCourseResponse[];
}
export declare class CourseResponse {
    id: string;
    code: string;
    title: string;
    lecturerId: string;
}
export declare class EnrollmentResponse {
    id: string;
    scores: Scores;
    courseId: string;
    studentId: string;
}
