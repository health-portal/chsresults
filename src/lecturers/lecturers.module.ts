import { Module } from '@nestjs/common';
import { LecturersService } from './lecturers.service';
import { LecturersController } from './lecturers.controller';
import { MessageQueueModule } from 'src/message-queue/message-queue.module';
import { TokensModule } from 'src/tokens/tokens.module';

@Module({
  imports: [MessageQueueModule, TokensModule],
  controllers: [LecturersController],
  providers: [LecturersService],
})
export class LecturersModule {}
