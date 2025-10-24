import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtModule } from '@nestjs/jwt';
import { env } from './lib/environment';
import { CoursesModule } from './courses/courses.module';
import { StudentsModule } from './students/students.module';
import { LecturersModule } from './lecturers/lecturers.module';
import { AdminModule } from './admin/admin.module';
import { TokensModule } from './tokens/tokens.module';
import { CollegeModule } from './college/college.module';
import { SessionsModule } from './sessions/sessions.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ScheduleModule.forRoot(),
    JwtModule.register({ global: true, secret: env.JWT_SECRET }),
    CoursesModule,
    StudentsModule,
    LecturersModule,
    AdminModule,
    TokensModule,
    CollegeModule,
    SessionsModule,
  ],
})
export class AppModule {}
