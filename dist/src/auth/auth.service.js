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
const email_queue_service_1 = require("../email-queue/email-queue.service");
const email_queue_schema_1 = require("../email-queue/email-queue.schema");
let AuthService = class AuthService {
    db;
    jwtService;
    emailQueueService;
    constructor(db, jwtService, emailQueueService) {
        this.db = db;
        this.jwtService = jwtService;
        this.emailQueueService = emailQueueService;
    }
    generateToken(payload, expiresIn = '1d') {
        return { accessToken: this.jwtService.sign(payload, { expiresIn }) };
    }
    async findAdmin(email) {
        return await this.db.client.query.admin.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.admin.email, email),
        });
    }
    async updateAdminPassword(id, hashedPassword) {
        const [updatedAdmin] = await this.db.client
            .update(schema_1.admin)
            .set({ password: hashedPassword })
            .where((0, drizzle_orm_1.eq)(schema_1.admin.id, id))
            .returning();
        const { password: _, ...adminProfile } = updatedAdmin;
        return adminProfile;
    }
    async activateAdmin({ email, password }) {
        const foundAdmin = await this.findAdmin(email);
        if (!foundAdmin)
            throw new common_1.UnauthorizedException(`Admin not found`);
        if (foundAdmin.password)
            throw new common_1.BadRequestException(`Admin already activated`);
        const hashedPassword = await bcrypt.hash(password, 10);
        return this.updateAdminPassword(foundAdmin.id, hashedPassword);
    }
    async signinAdmin({ email, password }) {
        const foundAdmin = await this.findAdmin(email);
        if (!foundAdmin)
            throw new common_1.UnauthorizedException(`Admin not found`);
        if (!foundAdmin.password)
            throw new common_1.ForbiddenException(`Admin not activated`);
        const isMatched = await bcrypt.compare(password, foundAdmin.password);
        if (!isMatched)
            throw new common_1.UnauthorizedException('Invalid credentials');
        return this.generateToken({
            id: foundAdmin.id,
            role: auth_schema_1.UserRole.ADMIN,
        });
    }
    async adminResetPasswordRequest(email) {
        const foundAdmin = await this.findAdmin(email);
        if (!foundAdmin)
            throw new common_1.NotFoundException(`Admin not found`);
        await this.emailQueueService.createTask({
            subject: 'Reset Password',
            toEmail: foundAdmin.email,
            htmlContent: (0, email_queue_schema_1.ResetPasswordTemplate)({
                name: foundAdmin.name,
                resetLink: '',
            }),
        });
        return { success: true, message: `Reset link sent to ${email}` };
    }
    async adminResetPassword({ email, password }) {
        const foundAdmin = await this.findAdmin(email);
        if (!foundAdmin)
            throw new common_1.NotFoundException(`Admin not found`);
        const hashedPassword = await bcrypt.hash(password, 10);
        return this.updateAdminPassword(foundAdmin.id, hashedPassword);
    }
    async findLecturer(email) {
        return this.db.client.query.lecturer.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.lecturer.email, email),
        });
    }
    async updateLecturerPassword(id, hashedPassword) {
        const [updatedLecturer] = await this.db.client
            .update(schema_1.lecturer)
            .set({ password: hashedPassword })
            .where((0, drizzle_orm_1.eq)(schema_1.lecturer.id, id))
            .returning();
        const { password: _, ...lecturerProfile } = updatedLecturer;
        return lecturerProfile;
    }
    async activateLecturer({ email, password }) {
        const foundLecturer = await this.findLecturer(email);
        if (!foundLecturer)
            throw new common_1.UnauthorizedException(`Lecturer not found`);
        if (foundLecturer.password)
            throw new common_1.BadRequestException(`Lecturer already activated`);
        const hashedPassword = await bcrypt.hash(password, 10);
        return this.updateLecturerPassword(foundLecturer.id, hashedPassword);
    }
    async signinLecturer({ email, password }) {
        const foundLecturer = await this.findLecturer(email);
        if (!foundLecturer)
            throw new common_1.UnauthorizedException(`Lecturer not found`);
        if (!foundLecturer.password)
            throw new common_1.ForbiddenException(`Lecturer not activated`);
        const isMatched = await bcrypt.compare(password, foundLecturer.password);
        if (!isMatched)
            throw new common_1.UnauthorizedException('Invalid credentials');
        return this.generateToken({
            id: foundLecturer.id,
            role: auth_schema_1.UserRole.LECTURER,
        });
    }
    async lecturerResetPasswordRequest(email) {
        const foundLecturer = await this.findLecturer(email);
        if (!foundLecturer)
            throw new common_1.NotFoundException(`Lecturer not found`);
        await this.emailQueueService.createTask({
            subject: 'Reset Password',
            toEmail: foundLecturer.email,
            htmlContent: (0, email_queue_schema_1.ResetPasswordTemplate)({
                name: `${foundLecturer.firstName} ${foundLecturer.lastName}`,
                resetLink: '',
            }),
        });
        return { success: true, message: `Reset link sent to ${email}` };
    }
    async lecturerResetPassword({ email, password }) {
        const foundLecturer = await this.findLecturer(email);
        if (!foundLecturer)
            throw new common_1.NotFoundException(`Lecturer not found`);
        const hashedPassword = await bcrypt.hash(password, 10);
        return this.updateLecturerPassword(foundLecturer.id, hashedPassword);
    }
    async findStudent({ studentIdentifier, identifierType, }) {
        const foundStudent = await this.db.client.query.student.findFirst({
            where: identifierType === auth_schema_1.StudentIdentifierType.EMAIL
                ? (0, drizzle_orm_1.eq)(schema_1.student.email, studentIdentifier)
                : (0, drizzle_orm_1.eq)(schema_1.student.matricNumber, studentIdentifier),
        });
        if (!foundStudent)
            throw new common_1.NotFoundException(`Student not found`);
        return foundStudent;
    }
    async updateStudentPassword(id, hashedPassword) {
        const [updatedStudent] = await this.db.client
            .update(schema_1.student)
            .set({ password: hashedPassword })
            .where((0, drizzle_orm_1.eq)(schema_1.student.id, id))
            .returning();
        const { password: _, ...studentProfile } = updatedStudent;
        return studentProfile;
    }
    async activateStudent({ studentIdentifier, identifierType, password, }) {
        const foundStudent = await this.findStudent({
            studentIdentifier,
            identifierType,
        });
        if (foundStudent.password)
            throw new common_1.UnauthorizedException(`Student already activated`);
        const hashedPassword = await bcrypt.hash(password, 10);
        return this.updateStudentPassword(foundStudent.id, hashedPassword);
    }
    async signinStudent({ studentIdentifier, identifierType, password, }) {
        const foundStudent = await this.findStudent({
            studentIdentifier,
            identifierType,
        });
        if (!foundStudent.password)
            throw new common_1.ForbiddenException(`Student not activated`);
        const isMatched = await bcrypt.compare(password, foundStudent.password);
        if (!isMatched)
            throw new common_1.UnauthorizedException('Invalid credentials');
        return this.generateToken({
            id: foundStudent.id,
            role: auth_schema_1.UserRole.STUDENT,
        });
    }
    async studentResetPasswordRequest({ studentIdentifier, identifierType, }) {
        const foundStudent = await this.findStudent({
            studentIdentifier,
            identifierType,
        });
        await this.emailQueueService.createTask({
            subject: 'Reset Password',
            toEmail: foundStudent.email,
            htmlContent: (0, email_queue_schema_1.ResetPasswordTemplate)({
                name: `${foundStudent.firstName} ${foundStudent.lastName}`,
                resetLink: '',
            }),
        });
        return {
            success: true,
            message: `Reset link sent to ${foundStudent.email}`,
        };
    }
    async studentResetPassword({ studentIdentifier, identifierType, password, }) {
        const foundStudent = await this.findStudent({
            studentIdentifier,
            identifierType,
        });
        const hashedPassword = await bcrypt.hash(password, 10);
        return this.updateStudentPassword(foundStudent.id, hashedPassword);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        jwt_1.JwtService,
        email_queue_service_1.EmailQueueService])
], AuthService);
//# sourceMappingURL=auth.service.js.map