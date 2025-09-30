"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LecturerService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../../drizzle/schema");
const database_service_1 = require("../database/database.service");
const lecturer_schema_1 = require("./lecturer.schema");
const auth_schema_1 = require("../auth/auth.schema");
const csv_1 = require("../utils/csv");
let LecturerService = class LecturerService {
    db;
    constructor(db) {
        this.db = db;
    }
    async validateCourseAccess(lecturerId, courseId) {
        const foundCourse = await this.db.client.query.course.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.course.id, courseId), (0, drizzle_orm_1.eq)(schema_1.course.lecturerId, lecturerId)),
        });
        if (!foundCourse) {
            throw new common_1.ForbiddenException('You are not authorized to access this course');
        }
    }
    async listCourses(lecturerId) {
        return await this.db.client.query.course.findMany({
            where: (0, drizzle_orm_1.eq)(schema_1.course.lecturerId, lecturerId),
        });
    }
    async registerStudentsBatch(lecturerId, courseId, file) {
        await this.validateCourseAccess(lecturerId, courseId);
        const parsedData = await (0, csv_1.parseCsvFile)(file, lecturer_schema_1.RegisterStudentRow);
        const result = {
            registeredStudents: [],
            unregisteredStudents: [],
            ...parsedData,
        };
        await this.db.client.transaction(async (tx) => {
            for (const { matricNumber, session } of parsedData.validRows) {
                const foundStudent = await tx.query.student.findFirst({
                    where: (0, drizzle_orm_1.eq)(schema_1.student.matricNumber, matricNumber),
                });
                if (foundStudent) {
                    const [insertedEnrollment] = await tx
                        .insert(schema_1.enrollment)
                        .values({ courseId, studentId: foundStudent.id, session })
                        .returning()
                        .onConflictDoNothing();
                    if (insertedEnrollment)
                        result.registeredStudents.push(matricNumber);
                    else
                        result.unregisteredStudents.push(matricNumber);
                }
                else {
                    result.unregisteredStudents.push(matricNumber);
                }
            }
        });
        return result;
    }
    async registerStudent(lecturerId, courseId, { studentIdentifier, identifierType, session }) {
        await this.validateCourseAccess(lecturerId, courseId);
        const whereCondition = identifierType === auth_schema_1.StudentIdentifierType.EMAIL
            ? (0, drizzle_orm_1.eq)(schema_1.student.email, studentIdentifier)
            : (0, drizzle_orm_1.eq)(schema_1.student.matricNumber, studentIdentifier);
        const foundStudent = await this.db.client.query.student.findFirst({
            where: whereCondition,
        });
        if (!foundStudent) {
            throw new common_1.NotFoundException(`Student not found with ${identifierType}: ${studentIdentifier}`);
        }
        const foundEnrollment = await this.db.client.query.enrollment.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.enrollment.courseId, courseId), (0, drizzle_orm_1.eq)(schema_1.enrollment.studentId, foundStudent.id)),
        });
        if (foundEnrollment) {
            throw new common_1.ConflictException('Student is already enrolled in this course');
        }
        const [insertedEnrollment] = await this.db.client
            .insert(schema_1.enrollment)
            .values({
            courseId,
            studentId: foundStudent.id,
            session,
        })
            .returning();
        return insertedEnrollment;
    }
    async uploadScores(lecturerId, courseId, file) {
        await this.validateCourseAccess(lecturerId, courseId);
        const parsedData = await (0, csv_1.parseCsvFile)(file, lecturer_schema_1.UploadScoreRow);
        const result = {
            studentsUploadedFor: [],
            studentsNotFound: [],
            ...parsedData,
        };
        await this.db.client.transaction(async (tx) => {
            for (const { matricNumber, continuousAssessment, examination, } of parsedData.validRows) {
                const foundStudent = await tx.query.student.findFirst({
                    where: (0, drizzle_orm_1.eq)(schema_1.student.matricNumber, matricNumber),
                });
                if (foundStudent) {
                    await tx
                        .update(schema_1.enrollment)
                        .set({ scores: { continuousAssessment, examination } })
                        .where((0, drizzle_orm_1.eq)(schema_1.enrollment.studentId, foundStudent.id))
                        .returning();
                    result.studentsUploadedFor.push(matricNumber);
                }
                else {
                    result.studentsNotFound.push(matricNumber);
                }
            }
        });
        return result;
    }
    async editScore(lecturerId, courseId, studentId, body) {
        await this.validateCourseAccess(lecturerId, courseId);
        const foundEnrollment = await this.db.client.query.enrollment.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.enrollment.courseId, courseId), (0, drizzle_orm_1.eq)(schema_1.enrollment.studentId, studentId)),
        });
        if (!foundEnrollment) {
            throw new common_1.NotFoundException('Student not found in this course');
        }
        const [updatedEnrollment] = await this.db.client
            .update(schema_1.enrollment)
            .set({ scores: body })
            .where((0, drizzle_orm_1.eq)(schema_1.enrollment.studentId, foundEnrollment.studentId))
            .returning();
        return updatedEnrollment;
    }
    async viewCourseScores(lecturerId, courseId) {
        const foundCourse = await this.db.client.query.course.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.course.id, courseId), (0, drizzle_orm_1.eq)(schema_1.course.lecturerId, lecturerId)),
        });
        if (!foundCourse) {
            throw new common_1.ForbiddenException('You are not authorized to view this course');
        }
        const foundEnrollments = await this.db.client.query.enrollment.findMany({
            where: (0, drizzle_orm_1.eq)(schema_1.enrollment.courseId, courseId),
        });
        return foundEnrollments;
    }
    async listCourseStudents(lecturerId, courseId) {
        const foundCourse = await this.db.client.query.course.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.course.id, courseId), (0, drizzle_orm_1.eq)(schema_1.course.lecturerId, lecturerId)),
        });
        if (!foundCourse) {
            throw new common_1.ForbiddenException('You are not authorized to view this course');
        }
        const foundEnrollments = await this.db.client.query.enrollment.findMany({
            where: (0, drizzle_orm_1.eq)(schema_1.enrollment.courseId, courseId),
            with: { student: { columns: { password: false } } },
        });
        return foundEnrollments;
    }
    async getProfile(lecturerId) {
        const foundLecturer = await this.db.client.query.lecturer.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.lecturer.id, lecturerId),
            columns: { password: false },
        });
        if (!foundLecturer)
            throw new common_1.UnauthorizedException('Lecturer not found');
        return foundLecturer;
    }
};
exports.LecturerService = LecturerService;
exports.LecturerService = LecturerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], LecturerService);
//# sourceMappingURL=lecturer.service.js.map