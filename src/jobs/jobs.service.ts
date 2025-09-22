import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Queue } from "bullmq";
import { DatabaseService } from "src/database/database.service";
import { LecturerRepository } from "src/repository/lecturer.repo";
import { StudentRepository } from "src/repository/student.repo";
import { job } from "drizzle/schema";

@Injectable()
export class JobService {
    constructor(
        @InjectQueue('student-import') private queue: Queue,
        @InjectQueue('lecturer-import') private queueLecturer: Queue,
        private readonly db: DatabaseService,
        private readonly lecturerRepository: LecturerRepository,
        private readonly studentRepository: StudentRepository,
    ) { }

    async createLecturers(file: any, createdBy: string) {
        // Create job record
        const jobRecord = await this.db.client.insert(job).values({
            type: 'lecturer-import',
            createdBy,
            status: 'pending',
            percentageComplete: 0,
            data: { fileName: file.originalname }
        }).returning().then(res => res[0]);

        // Add to queue
        await this.queueLecturer.add('import-lecturers', {
            jobId: jobRecord.id,
            filePath: file.path,
            createdBy
        });

        return jobRecord;
    }

    async createStudents(file: any, createdBy: string) {
        // Create job record
        const jobRecord = await this.db.client.insert(job).values({
            type: 'student-import',
            createdBy,
            status: 'pending',
            percentageComplete: 0,
            data: { fileName: file.originalname }
        }).returning().then(res => res[0]);

        // Add to queue
        await this.queue.add('import-students', {
            jobId: jobRecord.id,
            filePath: file.path,
            createdBy
        });

        return jobRecord;
    }
}
