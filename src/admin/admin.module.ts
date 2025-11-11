import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MessageQueueModule } from 'src/message-queue/message-queue.module';
import { TokensModule } from 'src/tokens/tokens.module';

@Module({
  imports: [MessageQueueModule, TokensModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
