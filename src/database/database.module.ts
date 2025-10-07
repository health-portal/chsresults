import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { EmailQueueModule } from 'src/email-queue/email-queue.module';

@Global()
@Module({
  imports: [EmailQueueModule],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
