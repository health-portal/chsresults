import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtModule } from '@nestjs/jwt';
import { env } from './environment';
import { StaffModule } from './staff/staff.module';
import { CoursesModule } from './courses/courses.module';
import { StudentsModule } from './students/students.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ScheduleModule.forRoot(),
    JwtModule.register({ global: true, secret: env.JWT_SECRET }),
    StaffModule,
    CoursesModule,
    StudentsModule,
  ],
})
export class AppModule {}
