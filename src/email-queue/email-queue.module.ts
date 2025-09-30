import { Module } from '@nestjs/common';
import { EmailQueueService } from './email-queue.service';

@Module({
  providers: [EmailQueueService],
  exports: [EmailQueueService],
})
export class EmailQueueModule {}
