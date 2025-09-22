import { admin, lecturer, student } from '../../drizzle/schema';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';

// Admin types
export type Admin = typeof admin.$inferSelect;
export type CreateAdmin = typeof admin.$inferInsert;
export type UpdateAdmin = Partial<CreateAdmin>;

// Lecturer types
export type Lecturer = typeof lecturer.$inferSelect;
export type CreateLecturer = typeof lecturer.$inferInsert;
export type UpdateLecturer = Partial<CreateLecturer>;

// Student types
export type Student = typeof student.$inferSelect;
export type CreateStudent = typeof student.$inferInsert;
export type UpdateStudent = Partial<CreateStudent>;

// Admin DTOs
export class CreateAdminDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;
}

export class AdminResponseDto {
    @ApiProperty()
    @IsUUID()
    id: string;

    @ApiProperty()
    @IsString()
    email: string;

    @ApiProperty()
    @IsString()
    name: string;
}

export class UpdateAdminDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    email?: string;

    // @ApiProperty({ required: false })
    // @IsOptional()
    // @IsString()
    // password?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    name?: string;
}

// Lecturer DTOs
export class CreateLecturerDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    otherName?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    departmentId: string;
}

export class LecturerResponseDto {
    @ApiProperty()
    @IsUUID()
    id: string;

    @ApiProperty()
    @IsString()
    email: string;

    @ApiProperty()
    @IsString()
    firstName: string;

    @ApiProperty()
    @IsString()
    lastName: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    otherName?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty()
    @IsUUID()
    departmentId: string;
}

export class UpdateLecturerDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    email?: string;

    // @ApiProperty({ required: false })
    // @IsOptional()
    // @IsString()
    // password?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    firstName?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    lastName?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    otherName?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    departmentId?: string;
}

// Student DTOs
export class CreateStudentDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    matricNumber: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    otherName?: string;

    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    departmentId: string;
}

export class StudentResponseDto {
    @ApiProperty()
    @IsUUID()
    id: string;

    @ApiProperty()
    @IsString()
    email: string;

    @ApiProperty()
    @IsString()
    matricNumber: string;

    @ApiProperty()
    @IsString()
    firstName: string;

    @ApiProperty()
    @IsString()
    lastName: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    otherName?: string;

    @ApiProperty()
    @IsUUID()
    departmentId: string;
}

export class UpdateStudentDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    email?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    matricNumber?: string;

    // @ApiProperty({ required: false })
    // @IsOptional()
    // @IsString()
    // password?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    firstName?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    lastName?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    otherName?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    departmentId?: string;
}