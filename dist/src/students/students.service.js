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
exports.StudentsService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const students_schema_1 = require("./students.schema");
const schema_1 = require("../../drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const csv_1 = require("../utils/csv");
let StudentsService = class StudentsService {
    db;
    constructor(db) {
        this.db = db;
    }
    async createStudent(body) {
        const foundStudent = await this.db.client.query.student.findFirst({
            where: (0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema_1.student.matricNumber, body.matricNumber), (0, drizzle_orm_1.eq)(schema_1.student.email, body.email)),
        });
        if (foundStudent)
            throw new common_1.BadRequestException('Student already registered');
        const foundDepartment = await this.db.client.query.department.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.department.name, body.department),
        });
        if (!foundDepartment)
            throw new common_1.BadRequestException('Department not found');
        const [insertedStudent] = await this.db.client
            .insert(schema_1.student)
            .values({ ...body, departmentId: foundDepartment.id })
            .returning();
        const { password: _, ...studentProfile } = insertedStudent;
        return studentProfile;
    }
    async createStudents(file) {
        const parsedData = await (0, csv_1.parseCsvFile)(file, students_schema_1.CreateStudentBody);
        const result = { students: [], ...parsedData };
        await this.db.client.transaction(async (tx) => {
            for (const row of parsedData.validRows) {
                const foundDepartment = await tx.query.department.findFirst({
                    where: (0, drizzle_orm_1.eq)(schema_1.department.name, row.department),
                });
                if (!foundDepartment)
                    result.students.push({ ...row, isCreated: false });
                else {
                    const [insertedStudent] = await tx
                        .insert(schema_1.student)
                        .values({ ...row, departmentId: foundDepartment.id })
                        .returning()
                        .onConflictDoNothing();
                    if (insertedStudent)
                        result.students.push({ ...row, isCreated: true });
                    else
                        result.students.push({ ...row, isCreated: false });
                }
            }
        });
        return result;
    }
    async getStudents() {
        const foundStudents = await this.db.client.query.student.findMany();
        return foundStudents.map((s) => {
            const { password: _, ...studentProfile } = s;
            return studentProfile;
        });
    }
    async updateStudent(studentId, body) {
        const foundStudent = await this.db.client.query.student.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.student.id, studentId),
        });
        if (!foundStudent)
            throw new common_1.NotFoundException('Student not found');
        let departmentId = foundStudent.departmentId;
        if (body.department) {
            const foundDepartment = await this.db.client.query.department.findFirst({
                where: (0, drizzle_orm_1.eq)(schema_1.department.name, body.department),
            });
            if (!foundDepartment)
                throw new common_1.BadRequestException('Department not found');
            departmentId = foundDepartment.id;
        }
        const [updatedStudent] = await this.db.client
            .update(schema_1.student)
            .set({ ...body, departmentId })
            .where((0, drizzle_orm_1.eq)(schema_1.student.id, studentId))
            .returning();
        const { password: _, ...studentProfile } = updatedStudent;
        return studentProfile;
    }
    async deleteStudent(studentId) {
        const foundStudent = await this.db.client.query.student.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.student.id, studentId),
        });
        if (!foundStudent)
            throw new common_1.NotFoundException('Student not found');
        const [deleteStudent] = await this.db.client
            .delete(schema_1.student)
            .where((0, drizzle_orm_1.eq)(schema_1.student.id, studentId))
            .returning();
        const { password: _, ...studentProfile } = deleteStudent;
        return studentProfile;
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], StudentsService);
//# sourceMappingURL=students.service.js.map