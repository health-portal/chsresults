import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { JobService } from "./jobs.service";
import { RepositoryModule } from "src/repository/repository.module";
import { StudentImportProcessor } from "./student-import.processor";
import { LecturerImportProcessor } from "./lecturer-import.processor";

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'student-import'
        }),
        BullModule.registerQueue({
            name: 'lecturer-import'
        }),
        RepositoryModule
    ],
    providers: [JobService, StudentImportProcessor, LecturerImportProcessor],
    exports: [JobService],
})
export class JobsModule { }