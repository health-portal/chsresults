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
exports.CollegeService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const database_service_1 = require("../database/database.service");
const schema_1 = require("../../drizzle/schema");
let CollegeService = class CollegeService {
    db;
    constructor(db) {
        this.db = db;
    }
    async getDepartments() {
        return await this.db.client.query.faculty.findMany({
            with: { departments: true },
        });
    }
    async createFaculty(body) {
        const [insertedFaculty] = await this.db.client
            .insert(schema_1.faculty)
            .values(body)
            .returning();
        return insertedFaculty;
    }
    async updateFaculty(facultyId, body) {
        const [updatedFaculty] = await this.db.client
            .update(schema_1.faculty)
            .set(body)
            .where((0, drizzle_orm_1.eq)(schema_1.faculty.id, facultyId))
            .returning();
        if (!updatedFaculty)
            throw new common_1.NotFoundException('Faculty not found');
        return updatedFaculty;
    }
    async deleteFaculty(facultyId) {
        const [deletedFaculty] = await this.db.client
            .delete(schema_1.faculty)
            .where((0, drizzle_orm_1.eq)(schema_1.faculty.id, facultyId))
            .returning();
        if (!deletedFaculty)
            throw new common_1.NotFoundException('Faculty not found');
        return deletedFaculty;
    }
    async createDepartment({ facultyId, name }) {
        const [insertedDept] = await this.db.client
            .insert(schema_1.department)
            .values({ facultyId, name })
            .returning();
        return insertedDept;
    }
    async updateDepartment(deptId, body) {
        const [updatedDept] = await this.db.client
            .update(schema_1.department)
            .set(body)
            .where((0, drizzle_orm_1.eq)(schema_1.department.id, deptId))
            .returning();
        if (!updatedDept)
            throw new common_1.NotFoundException('Department not found');
        return updatedDept;
    }
    async deleteDepartment(deptId) {
        const [deletedDept] = await this.db.client
            .delete(schema_1.department)
            .where((0, drizzle_orm_1.eq)(schema_1.department.id, deptId))
            .returning();
        if (!deletedDept)
            throw new common_1.NotFoundException('Department not found');
        return deletedDept;
    }
};
exports.CollegeService = CollegeService;
exports.CollegeService = CollegeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], CollegeService);
//# sourceMappingURL=college.service.js.map