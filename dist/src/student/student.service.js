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
exports.StudentService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../../drizzle/schema");
const database_service_1 = require("../database/database.service");
let StudentService = class StudentService {
    db;
    constructor(db) {
        this.db = db;
    }
    async listEnrollments(studentId) {
        return await this.db.client.query.enrollment.findMany({
            where: (0, drizzle_orm_1.eq)(schema_1.enrollment.studentId, studentId),
        });
    }
    async listEnrollment(studentId, enrollmentId) {
        const foundEnrollment = await this.db.client.query.enrollment.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.enrollment.studentId, studentId), (0, drizzle_orm_1.eq)(schema_1.enrollment.id, enrollmentId)),
        });
        if (!foundEnrollment)
            throw new common_1.NotFoundException('Enrollment not found');
        return foundEnrollment;
    }
    async getProfile(studentId) {
        const foundStudent = await this.db.client.query.student.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.student.id, studentId),
            with: { department: true },
        });
        if (!foundStudent)
            throw new common_1.UnauthorizedException('Student not found');
        const { password: _, ...studentProfile } = foundStudent;
        return studentProfile;
    }
};
exports.StudentService = StudentService;
exports.StudentService = StudentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], StudentService);
//# sourceMappingURL=student.service.js.map