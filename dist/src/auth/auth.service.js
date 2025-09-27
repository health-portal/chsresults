"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const database_service_1 = require("../database/database.service");
const auth_schema_1 = require("./auth.schema");
const schema_1 = require("../../drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const bcrypt = __importStar(require("bcrypt"));
let AuthService = class AuthService {
    db;
    jwtService;
    constructor(db, jwtService) {
        this.db = db;
        this.jwtService = jwtService;
    }
    generateAccessToken(payload) {
        return { accessToken: this.jwtService.sign(payload) };
    }
    async findAdminOrLecturer(role, email) {
        switch (role) {
            case auth_schema_1.UserRole.ADMIN:
                return this.db.client.query.admin.findFirst({
                    where: (0, drizzle_orm_1.eq)(schema_1.admin.email, email),
                });
            case auth_schema_1.UserRole.LECTURER:
                return this.db.client.query.lecturer.findFirst({
                    where: (0, drizzle_orm_1.eq)(schema_1.lecturer.email, email),
                });
            default:
                throw new common_1.UnauthorizedException('Role not supported here');
        }
    }
    async findStudent({ studentIdentifier, identifierType, }) {
        const studentRecord = await this.db.client.query.student.findFirst({
            where: identifierType === auth_schema_1.StudentIdentifierType.EMAIL
                ? (0, drizzle_orm_1.eq)(schema_1.student.email, studentIdentifier)
                : (0, drizzle_orm_1.eq)(schema_1.student.matricNumber, studentIdentifier),
        });
        if (!studentRecord)
            throw new common_1.NotFoundException(`Student not found`);
        return studentRecord;
    }
    async updatePassword(role, id, hashedPassword) {
        switch (role) {
            case auth_schema_1.UserRole.ADMIN: {
                const updatedAdmin = await this.db.client
                    .update(schema_1.admin)
                    .set({ password: hashedPassword })
                    .where((0, drizzle_orm_1.eq)(schema_1.admin.id, id))
                    .returning();
                const { password, ...adminProfile } = updatedAdmin[0];
                return adminProfile;
            }
            case auth_schema_1.UserRole.LECTURER: {
                const updatedLecturer = await this.db.client
                    .update(schema_1.lecturer)
                    .set({ password: hashedPassword })
                    .where((0, drizzle_orm_1.eq)(schema_1.lecturer.id, id))
                    .returning();
                const { password, ...lecturerProfile } = updatedLecturer[0];
                return lecturerProfile;
            }
            case auth_schema_1.UserRole.STUDENT: {
                const updatedStudent = await this.db.client
                    .update(schema_1.student)
                    .set({ password: hashedPassword })
                    .where((0, drizzle_orm_1.eq)(schema_1.student.id, id))
                    .returning();
                const { password, ...studentProfile } = updatedStudent[0];
                return studentProfile;
            }
            default:
                throw new common_1.UnauthorizedException('Role not supported here');
        }
    }
    async activate(role, { email, password }) {
        const user = await this.findAdminOrLecturer(role, email);
        if (!user)
            throw new common_1.UnauthorizedException(`${role} not found`);
        if (user.password)
            throw new common_1.BadRequestException(`${role} already activated`);
        const hashedPassword = await bcrypt.hash(password, 10);
        return await this.updatePassword(role, user.id, hashedPassword);
    }
    async signin(role, { email, password }) {
        const user = await this.findAdminOrLecturer(role, email);
        if (!user)
            throw new common_1.UnauthorizedException(`${role} not found`);
        if (!user.password)
            throw new common_1.ForbiddenException(`${role} not activated`);
        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched)
            throw new common_1.UnauthorizedException('Invalid credentials');
        return this.generateAccessToken({ id: user.id, role });
    }
    async resetPasswordRequest(role, email) {
        const user = await this.findAdminOrLecturer(role, email);
        if (!user)
            throw new common_1.NotFoundException(`${role} not found`);
        return { success: true, message: `Reset link sent to ${email}` };
    }
    async resetPassword(role, { email, password }) {
        const user = await this.findAdminOrLecturer(role, email);
        if (!user)
            throw new common_1.NotFoundException(`${role} not found`);
        const hashedPassword = await bcrypt.hash(password, 10);
        return await this.updatePassword(role, user.id, hashedPassword);
    }
    async activateStudentAccount({ studentIdentifier, identifierType, password, }) {
        const studentRecord = await this.findStudent({
            studentIdentifier,
            identifierType,
        });
        if (studentRecord.password)
            throw new common_1.UnauthorizedException(`Student already activated`);
        const hashedPassword = await bcrypt.hash(password, 10);
        return await this.updatePassword(auth_schema_1.UserRole.STUDENT, studentRecord.id, hashedPassword);
    }
    async signinStudent({ studentIdentifier, identifierType, password, }) {
        const studentRecord = await this.findStudent({
            studentIdentifier,
            identifierType,
        });
        if (!studentRecord.password)
            throw new common_1.ForbiddenException(`$Student not activated`);
        const isMatched = await bcrypt.compare(password, studentRecord.password);
        if (!isMatched)
            throw new common_1.UnauthorizedException('Invalid credentials');
        return this.generateAccessToken({
            id: studentRecord.id,
            role: auth_schema_1.UserRole.STUDENT,
        });
    }
    async studentResetPasswordRequest({ studentIdentifier, identifierType, }) {
        const studentRecord = await this.findStudent({
            studentIdentifier,
            identifierType,
        });
        return {
            success: true,
            message: `Reset link sent to ${studentRecord.email}`,
        };
    }
    async studentResetPassword({ studentIdentifier, identifierType, password, }) {
        const studentRecord = await this.findStudent({
            studentIdentifier,
            identifierType,
        });
        const hashedPassword = await bcrypt.hash(password, 10);
        return await this.updatePassword(auth_schema_1.UserRole.STUDENT, studentRecord.id, hashedPassword);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map