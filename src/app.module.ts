import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DatabaseModule, AdminModule, AuthModule],
})
export class AppModule {}
