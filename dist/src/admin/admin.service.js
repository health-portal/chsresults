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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../../drizzle/schema");
const database_service_1 = require("../database/database.service");
let AdminService = class AdminService {
    db;
    constructor(db) {
        this.db = db;
    }
    async addAdmin({ email, name }) {
        const foundAdmin = await this.db.client.query.admin.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.admin.email, email),
        });
        if (foundAdmin)
            throw new common_1.BadRequestException('Admin already exists');
        const insertedAdmin = await this.db.client
            .insert(schema_1.admin)
            .values({ email, name })
            .returning();
        const { password: _, ...adminProfile } = insertedAdmin[0];
        return adminProfile;
    }
    async getProfile(adminId) {
        const foundAdmin = await this.db.client.query.admin.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.admin.id, adminId),
        });
        if (!foundAdmin)
            throw new common_1.UnauthorizedException('Admin not found');
        const { password: _, ...adminProfile } = foundAdmin;
        return adminProfile;
    }
    async updateProfile(adminId, { name, phone }) {
        const foundAdmin = await this.db.client.query.admin.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.admin.id, adminId),
        });
        if (!foundAdmin)
            throw new common_1.BadRequestException('Admin not found');
        const updatedAdmin = await this.db.client
            .update(schema_1.admin)
            .set({ name, phone })
            .returning();
        const { password: _, ...adminProfile } = updatedAdmin[0];
        return adminProfile;
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], AdminService);
//# sourceMappingURL=admin.service.js.map