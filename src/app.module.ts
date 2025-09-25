import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { DatabaseModule } from './database/database.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { LecturerModule } from './lecturer/lecturer.module';
import { env } from './environment';
import { StudentModule } from './student/student.module';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
        // password: env.REDIS_PASS
      }
    }),
    BullModule.registerQueue({
      name: 'student-import'
    }),
    DatabaseModule,
    AdminModule,
    AuthModule,
    LecturerModule,
    StudentModule
  ],
})
export class AppModule { }
