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
exports.CoursesService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const courses_schema_1 = require("./courses.schema");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../../drizzle/schema");
const csv_1 = require("../utils/csv");
let CoursesService = class CoursesService {
    db;
    constructor(db) {
        this.db = db;
    }
    async createCourse({ code, title, lecturerEmail, semester, units, }) {
        const foundCourse = await this.db.client.query.course.findFirst({
            where: (0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema_1.course.title, title), (0, drizzle_orm_1.eq)(schema_1.course.code, code)),
        });
        if (foundCourse)
            throw new common_1.BadRequestException('Course with name or title already registered');
        const foundLecturer = await this.db.client.query.lecturer.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.lecturer.email, lecturerEmail),
        });
        if (!foundLecturer)
            throw new common_1.BadRequestException('Lecturer not found');
        const [insertedCourse] = await this.db.client
            .insert(schema_1.course)
            .values({ code, title, lecturerId: foundLecturer.id, semester, units })
            .returning();
        return insertedCourse;
    }
    async createCourses(file) {
        const parsedData = await (0, csv_1.parseCsvFile)(file, courses_schema_1.UpsertCourseBody);
        const result = { courses: [], ...parsedData };
        await this.db.client.transaction(async (tx) => {
            for (const row of parsedData.validRows) {
                const foundCourse = await tx.query.course.findFirst({
                    where: (0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema_1.course.title, row.title), (0, drizzle_orm_1.eq)(schema_1.course.code, row.code)),
                });
                if (foundCourse) {
                    result.courses.push({ ...row, isCreated: false });
                    continue;
                }
                const foundLecturer = await this.db.client.query.lecturer.findFirst({
                    where: (0, drizzle_orm_1.eq)(schema_1.lecturer.email, row.lecturerEmail),
                });
                if (!foundLecturer) {
                    result.courses.push({ ...row, isCreated: false });
                    continue;
                }
                await tx
                    .insert(schema_1.course)
                    .values({ ...row, lecturerId: foundLecturer.id });
                result.courses.push({ ...row, isCreated: true });
            }
        });
        return result;
    }
    async getCourses() {
        return await this.db.client.query.course.findMany();
    }
    async updateCourse(courseId, { code, title, lecturerEmail, description, semester, units, }) {
        const foundCourse = await this.db.client.query.course.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.course.id, courseId),
        });
        if (!foundCourse)
            throw new common_1.BadRequestException('Course with name or title not found');
        const foundLecturer = await this.db.client.query.lecturer.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.lecturer.email, lecturerEmail),
        });
        if (!foundLecturer)
            throw new common_1.BadRequestException('Lecturer not found');
        const [updatedCourse] = await this.db.client
            .update(schema_1.course)
            .set({
            code,
            title,
            lecturerId: foundLecturer.id,
            description,
            semester,
            units,
        })
            .returning();
        return updatedCourse;
    }
    async deleteCourse(courseId) {
        const foundCourse = await this.db.client.query.course.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.course.id, courseId),
        });
        if (!foundCourse)
            throw new common_1.NotFoundException('Course not found');
        const [deletedCourse] = await this.db.client
            .delete(schema_1.course)
            .where((0, drizzle_orm_1.eq)(schema_1.course.id, courseId))
            .returning();
        return deletedCourse;
    }
};
exports.CoursesService = CoursesService;
exports.CoursesService = CoursesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], CoursesService);
//# sourceMappingURL=courses.service.js.map