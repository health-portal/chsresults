import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { EmailQueueModule } from 'src/email-queue/email-queue.module';

@Module({
  imports: [EmailQueueModule],
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule {}
