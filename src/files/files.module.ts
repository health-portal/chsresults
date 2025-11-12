import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { MessageQueueModule } from 'src/message-queue/message-queue.module';

@Module({
  imports: [MessageQueueModule],
  providers: [FilesService],
})
export class FilesModule {}
