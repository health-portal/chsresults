import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { EmailQueueModule } from 'src/email-queue/email-queue.module';

@Module({
  imports: [EmailQueueModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
