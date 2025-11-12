import { Module } from '@nestjs/common';
import { MessageQueueService } from './message-queue.service';
import { TokensModule } from 'src/tokens/tokens.module';

@Module({
  imports: [TokensModule],
  providers: [MessageQueueService],
  exports: [MessageQueueService],
})
export class MessageQueueModule {}
