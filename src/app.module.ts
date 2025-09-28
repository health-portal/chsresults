import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { LecturerModule } from './lecturer/lecturer.module';
import { StudentModule } from './student/student.module';
import { StudentsModule } from './students/students.module';
import { LecturersModule } from './lecturers/lecturers.module';
import { CoursesModule } from './courses/courses.module';
import { CollegeModule } from './college/college.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    DatabaseModule,
    AdminModule,
    AuthModule,
    LecturerModule,
    StudentModule,
    StudentsModule,
    LecturersModule,
    CoursesModule,
    CollegeModule,
    EmailModule,
  ],
})
export class AppModule {}
