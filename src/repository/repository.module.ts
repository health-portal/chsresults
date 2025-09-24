import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { LecturerRepository } from './lecturer.repo';
import { StudentRepository } from './student.repo';

@Module({
    imports: [DatabaseModule],
    providers: [LecturerRepository, StudentRepository],
    exports: [LecturerRepository, StudentRepository],
})
export class RepositoryModule { }