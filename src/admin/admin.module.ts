import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TokensModule } from 'src/tokens/tokens.module';

@Module({
  imports: [TokensModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
