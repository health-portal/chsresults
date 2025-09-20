import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { LecturerModule } from './lecturer/lecturer.module';

@Module({
  imports: [DatabaseModule, AdminModule, AuthModule, LecturerModule],
})
export class AppModule {}
