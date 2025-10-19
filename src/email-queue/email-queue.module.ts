import { Module } from '@nestjs/common';
import { EmailQueueService } from './email-queue.service';
import { PrismaService } from './prisma.service';
import { EmailQueueController } from './email-queue.controller';

@Module({
  providers: [EmailQueueService, PrismaService],
  exports: [EmailQueueService],
  controllers: [EmailQueueController],
})
export class EmailQueueModule {}
