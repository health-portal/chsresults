import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { StudentRepository } from 'src/repository/student.repo';
import { DatabaseService } from 'src/database/database.service';
import { processCsvFile, CsvValidationError } from 'src/utils/csv/csv.utils';
import { studentCsvOptions } from 'src/constants/student-csv.constants';
import { eq } from 'drizzle-orm';
import { job } from 'drizzle/schema';

@Injectable()
@Processor('student-import')
export class StudentImportProcessor extends WorkerHost {
    private readonly logger = new Logger(StudentImportProcessor.name);

    constructor(
        private readonly studentRepo: StudentRepository,
        private readonly db: DatabaseService,
    ) {
        super();
    }

    async process(jobData: Job<{ jobId: string; filePath: string; createdBy: string }>): Promise<void> {
        const { jobId, filePath } = jobData.data;
        this.logger.log(`Starting student import job ${jobId}`);

        try {
            // Update job status to processing
            await this.updateJobStatus(jobId, 'processing', 5);

            // Process CSV file
            const students = await processCsvFile(filePath, studentCsvOptions);
            this.logger.log(`Parsed ${students.length} students from CSV`);

            if (students.length === 0) {
                await this.updateJobStatus(jobId, 'completed', 100, new Date());
                return;
            }

            // Batch create students in chunks
            const batchSize = 20;
            const totalBatches = Math.ceil(students.length / batchSize);
            let processedCount = 0;

            for (let i = 0; i < totalBatches; i++) {
                const batch = students.slice(i * batchSize, (i + 1) * batchSize);

                // Create batch
                await this.studentRepo.batchCreateStudent(batch);
                processedCount += batch.length;

                // Update progress (5% for parsing + 95% for processing)
                const progress = 5 + Math.round((processedCount / students.length) * 95);
                await this.updateJobStatus(jobId, 'processing', progress);

                this.logger.log(`Processed batch ${i + 1}/${totalBatches} (${processedCount}/${students.length} students)`);
            }

            // Update job as completed
            await this.updateJobStatus(jobId, 'completed', 100, new Date());

            this.logger.log(`Student import job ${jobId} completed successfully - ${students.length} students created`);
        } catch (error) {
            this.logger.error(`Student import job ${jobId} failed: ${error.message}`, error.stack);

            // Update job as failed
            await this.updateJobStatus(jobId, 'failed', 0, new Date(), error.message);

            throw error;
        }
    }

    private async updateJobStatus(
        jobId: string,
        status: string,
        percentageComplete: number,
        finishedAt?: Date,
        errorMessage?: string,
    ): Promise<void> {
        const updateData: any = {
            status,
            percentageComplete,
        };

        if (finishedAt) {
            updateData.finishedAt = finishedAt;
        }

        if (errorMessage) {
            updateData.data = { error: errorMessage };
        }

        await this.db.client.update(job).set(updateData).where(eq(job.id, jobId));
    }
}
