import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { LecturerRepository } from 'src/repository/lecturer.repo';
import { DatabaseService } from 'src/database/database.service';
import { processCsvFile, CsvValidationError } from 'src/utils/csv/csv.utils';
import { lecturerCsvOptions } from 'src/constants/lecturer-csv.constants';
import { eq } from 'drizzle-orm';
import { job } from 'drizzle/schema';

@Injectable()
@Processor('lecturer-import')
export class LecturerImportProcessor extends WorkerHost {
    private readonly logger = new Logger(LecturerImportProcessor.name);

    constructor(
        private readonly lecturerRepo: LecturerRepository,
        private readonly db: DatabaseService,
    ) {
        super();
    }

    async process(jobData: Job<{ jobId: string; filePath: string; createdBy: string }>): Promise<void> {
        const { jobId, filePath } = jobData.data;
        this.logger.log(`Starting lecturer import job ${jobId}`);

        try {
            // Update job status to processing
            await this.updateJobStatus(jobId, 'processing', 5);

            // Process CSV file
            const lecturers = await processCsvFile(filePath, lecturerCsvOptions);
            this.logger.log(`Parsed ${lecturers.length} lecturers from CSV`);

            if (lecturers.length === 0) {
                await this.updateJobStatus(jobId, 'completed', 100, new Date());
                return;
            }

            // Batch create lecturers in chunks
            const batchSize = 20;
            const totalBatches = Math.ceil(lecturers.length / batchSize);
            let processedCount = 0;

            for (let i = 0; i < totalBatches; i++) {
                const batch = lecturers.slice(i * batchSize, (i + 1) * batchSize);

                // Create batch
                await this.lecturerRepo.batchCreateLecturer(batch);
                processedCount += batch.length;

                // Update progress (5% for parsing + 95% for processing)
                const progress = 5 + Math.round((processedCount / lecturers.length) * 95);
                await this.updateJobStatus(jobId, 'processing', progress);

                this.logger.log(`Processed batch ${i + 1}/${totalBatches} (${processedCount}/${lecturers.length} lecturers)`);
            }

            // Update job as completed
            await this.updateJobStatus(jobId, 'completed', 100, new Date());

            this.logger.log(`Lecturer import job ${jobId} completed successfully - ${lecturers.length} lecturers created`);
        } catch (error) {
            this.logger.error(`Lecturer import job ${jobId} failed: ${error.message}`, error.stack);

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