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
exports.LecturersService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const lecturers_schema_1 = require("./lecturers.schema");
const schema_1 = require("../../drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const csv_1 = require("../utils/csv");
let LecturersService = class LecturersService {
    db;
    constructor(db) {
        this.db = db;
    }
    async createLecturer(body) {
        const foundLecturer = await this.db.client.query.lecturer.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.lecturer.email, body.email),
        });
        if (foundLecturer)
            throw new common_1.BadRequestException('Lecturer already registered');
        const foundDepartment = await this.db.client.query.department.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.department.name, body.department),
        });
        if (!foundDepartment)
            throw new common_1.BadRequestException('Department not found');
        const [insertedLecturer] = await this.db.client
            .insert(schema_1.lecturer)
            .values({ ...body, departmentId: foundDepartment.id })
            .returning();
        const { password: _, ...lecturerProfile } = insertedLecturer;
        return lecturerProfile;
    }
    async createLecturers(file) {
        const parsedData = await (0, csv_1.parseCsvFile)(file, lecturers_schema_1.CreateLecturerBody);
        const result = { lecturers: [], ...parsedData };
        await this.db.client.transaction(async (tx) => {
            for (const row of parsedData.validRows) {
                const foundDepartment = await tx.query.department.findFirst({
                    where: (0, drizzle_orm_1.eq)(schema_1.department.name, row.department),
                });
                if (!foundDepartment)
                    result.lecturers.push({ ...row, isCreated: false });
                else {
                    await tx
                        .insert(schema_1.lecturer)
                        .values({ ...row, departmentId: foundDepartment.id });
                    result.lecturers.push({ ...row, isCreated: true });
                }
            }
        });
        return result;
    }
    async getLecturers() {
        const foundLecturers = await this.db.client.query.lecturer.findMany();
        return foundLecturers.map((l) => {
            const { password: _, ...lecturerProfile } = l;
            return lecturerProfile;
        });
    }
    async updateLecturer(lecturerId, body) {
        const foundLecturer = await this.db.client.query.lecturer.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.lecturer.id, lecturerId),
        });
        if (!foundLecturer)
            throw new common_1.BadRequestException('Lecturer not found');
        const [updatedLecturer] = await this.db.client
            .update(schema_1.lecturer)
            .set(body)
            .where((0, drizzle_orm_1.eq)(schema_1.lecturer.id, lecturerId))
            .returning();
        const { password: _, ...lecturerProfile } = updatedLecturer;
        return lecturerProfile;
    }
    async deleteLecturer(lecturerId) {
        const [foundLecturer] = await this.db.client
            .delete(schema_1.lecturer)
            .where((0, drizzle_orm_1.eq)(schema_1.lecturer.id, lecturerId))
            .returning();
        if (!foundLecturer)
            throw new common_1.NotFoundException('Lecturer not found');
        const { password: _, ...lecturerProfile } = foundLecturer;
        return lecturerProfile;
    }
};
exports.LecturersService = LecturersService;
exports.LecturersService = LecturersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], LecturersService);
//# sourceMappingURL=lecturers.service.js.map