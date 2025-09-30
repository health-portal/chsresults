import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { EmailQueueModule } from 'src/email-queue/email-queue.module';

@Module({
  imports: [EmailQueueModule],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
