import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { EmailQueueModule } from 'src/email-queue/email-queue.module';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [EmailQueueModule, AuthService],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
