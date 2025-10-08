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
const email_queue_service_1 = require("../email-queue/email-queue.service");
const email_queue_schema_1 = require("../email-queue/email-queue.schema");
const environment_1 = require("../environment");
const drizzle_orm_2 = require("drizzle-orm");
let CoursesService = class CoursesService {
    db;
    emailQueueService;
    constructor(db, emailQueueService) {
        this.db = db;
        this.emailQueueService = emailQueueService;
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
        await this.emailQueueService.send({
            subject: 'Notification to Manage Course',
            toEmail: foundLecturer.email,
            htmlContent: (0, email_queue_schema_1.NotificationTemplate)({
                name: `${foundLecturer.title} ${foundLecturer.firstName} ${foundLecturer.lastName}`,
                message: `You have been selected to manage this course: ${insertedCourse.code}`,
                portalLink: `${environment_1.env.FRONTEND_BASE_URL}/auth`,
                title: `Notification to Manage Course`,
            }),
        });
        return insertedCourse;
    }
    async createCourses(file) {
        const parsedData = await (0, csv_1.parseCsvFile)(file, courses_schema_1.CreateCourseBody);
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
                const [insertedCourse] = await tx
                    .insert(schema_1.course)
                    .values({ ...row, lecturerId: foundLecturer.id })
                    .returning()
                    .onConflictDoNothing();
                if (insertedCourse) {
                    result.courses.push({ ...row, isCreated: true });
                    await this.emailQueueService.send({
                        subject: 'Notification to Manage Course',
                        toEmail: foundLecturer.email,
                        htmlContent: (0, email_queue_schema_1.NotificationTemplate)({
                            name: `${foundLecturer.title} ${foundLecturer.firstName} ${foundLecturer.lastName}`,
                            message: `You have been selected to manage this course: ${insertedCourse.code}`,
                            portalLink: `${environment_1.env.FRONTEND_BASE_URL}/auth`,
                            title: `Notification to Manage Course`,
                        }),
                    });
                }
                else
                    result.courses.push({ ...row, isCreated: false });
            }
        });
        return result;
    }
    async getCourses() {
        return await this.db.client
            .select({
            id: schema_1.course.id,
            code: schema_1.course.code,
            title: schema_1.course.title,
            description: schema_1.course.description,
            units: schema_1.course.units,
            semester: schema_1.course.semester,
            lecturer: {
                id: schema_1.lecturer.id,
                firstName: schema_1.lecturer.firstName,
                lastName: schema_1.lecturer.lastName,
                email: schema_1.lecturer.email,
            },
            enrollmentCount: (0, drizzle_orm_2.count)(schema_1.enrollment.id),
        })
            .from(schema_1.course)
            .leftJoin(schema_1.enrollment, (0, drizzle_orm_1.eq)(schema_1.enrollment.courseId, schema_1.course.id))
            .leftJoin(schema_1.lecturer, (0, drizzle_orm_1.eq)(schema_1.lecturer.id, schema_1.course.lecturerId))
            .groupBy(schema_1.course.id, schema_1.course.code, schema_1.course.title, schema_1.course.description, schema_1.course.units, schema_1.course.semester, schema_1.course.lecturerId, schema_1.lecturer.id, schema_1.lecturer.firstName, schema_1.lecturer.lastName, schema_1.lecturer.email);
    }
    async updateCourse(courseId, { code, title, lecturerEmail, description, semester, units, }) {
        const foundCourse = await this.db.client.query.course.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.course.id, courseId),
        });
        if (!foundCourse)
            throw new common_1.BadRequestException('Course not found');
        let lecturerId = foundCourse.lecturerId;
        if (lecturerEmail) {
            const foundLecturer = await this.db.client.query.lecturer.findFirst({
                where: (0, drizzle_orm_1.eq)(schema_1.lecturer.email, lecturerEmail),
            });
            if (!foundLecturer)
                throw new common_1.NotFoundException('Lecturer not found');
            lecturerId = foundLecturer.id;
        }
        const [updatedCourse] = await this.db.client
            .update(schema_1.course)
            .set({
            code,
            title,
            lecturerId,
            description,
            semester,
            units,
        })
            .where((0, drizzle_orm_1.eq)(schema_1.course.id, courseId))
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
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        email_queue_service_1.EmailQueueService])
], CoursesService);
//# sourceMappingURL=courses.service.js.map