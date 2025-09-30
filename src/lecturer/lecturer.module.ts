import { Module } from '@nestjs/common';
import { LecturerService } from './lecturer.service';
import { LecturerController } from './lecturer.controller';
import { EmailQueueModule } from 'src/email-queue/email-queue.module';

@Module({
  imports: [EmailQueueModule],
  controllers: [LecturerController],
  providers: [LecturerService],
})
export class LecturerModule {}
