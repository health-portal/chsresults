import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { RepositoryModule } from 'src/repository/repository.module';
import { JobsModule } from 'src/jobs/jobs.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'student-import'
    }),
    RepositoryModule,
    JobsModule
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule { }
