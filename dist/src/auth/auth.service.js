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
const environment_1 = require("../environment");
let AuthService = class AuthService {
    db;
    jwtService;
    emailQueueService;
    constructor(db, jwtService, emailQueueService) {
        this.db = db;
        this.jwtService = jwtService;
        this.emailQueueService = emailQueueService;
    }
    async generateToken(payload, expiresIn = '1d') {
        const token = await this.jwtService.signAsync(payload, { expiresIn });
        return token;
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
    async activateAdmin({ email, password, tokenString }) {
        const foundAdmin = await this.findAdmin(email);
        if (!foundAdmin)
            throw new common_1.UnauthorizedException(`Admin not found`);
        if (foundAdmin.password)
            throw new common_1.BadRequestException(`Admin already activated`);
        const foundToken = await this.db.client.query.token.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.token.userId, foundAdmin.id), (0, drizzle_orm_1.eq)(schema_1.token.userRole, auth_schema_1.UserRole.ADMIN)),
        });
        if (!foundToken)
            throw new common_1.NotFoundException('Token not found');
        if (foundToken.tokenString !== tokenString ||
            foundToken.tokenType !== auth_schema_1.TokenType.ACTIVATE_ACCOUNT)
            throw new common_1.BadRequestException('Invalid or expired token');
        this.jwtService
            .verifyAsync(tokenString)
            .then(() => { })
            .catch(() => {
            throw new common_1.BadRequestException('Invalid or expired token');
        });
        const hashedPassword = await bcrypt.hash(password, Number(environment_1.env.BCRYPT_SALT));
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
        const accessToken = await this.generateToken({
            id: foundAdmin.id,
            role: auth_schema_1.UserRole.ADMIN,
        });
        return { accessToken };
    }
    async adminResetPasswordRequest(email) {
        const foundAdmin = await this.findAdmin(email);
        if (!foundAdmin)
            throw new common_1.NotFoundException(`Admin not found`);
        const tokenString = await this.generateToken({ id: foundAdmin.id, role: auth_schema_1.UserRole.ADMIN }, '15m');
        await this.db.client
            .insert(schema_1.token)
            .values({
            userId: foundAdmin.id,
            userRole: auth_schema_1.UserRole.ADMIN,
            tokenString,
            tokenType: auth_schema_1.TokenType.RESET_PASSWORD,
        })
            .onConflictDoUpdate({
            target: [schema_1.token.userId, schema_1.token.userRole],
            set: { tokenString, tokenType: auth_schema_1.TokenType.RESET_PASSWORD },
        });
        await this.emailQueueService.send({
            subject: 'Reset Password',
            toEmail: foundAdmin.email,
            htmlContent: (0, email_queue_schema_1.ResetPasswordTemplate)({
                name: foundAdmin.name,
                resetLink: `${environment_1.env.FRONTEND_BASE_URL}/admin/reset-password/?token=${tokenString}`,
            }),
        });
        return { success: true, message: `Reset link sent to ${email}` };
    }
    async adminResetPassword({ email, password, tokenString }) {
        const foundAdmin = await this.findAdmin(email);
        if (!foundAdmin)
            throw new common_1.NotFoundException(`Admin not found`);
        const foundToken = await this.db.client.query.token.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.token.userId, foundAdmin.id), (0, drizzle_orm_1.eq)(schema_1.token.userRole, auth_schema_1.UserRole.ADMIN)),
        });
        if (!foundToken)
            throw new common_1.NotFoundException('Token not found');
        if (foundToken.tokenString !== tokenString ||
            foundToken.tokenType !== auth_schema_1.TokenType.RESET_PASSWORD)
            throw new common_1.BadRequestException('Invalid or expired token');
        this.jwtService
            .verifyAsync(tokenString)
            .then(() => { })
            .catch(() => {
            throw new common_1.BadRequestException('Invalid or expired token');
        });
        const hashedPassword = await bcrypt.hash(password, Number(environment_1.env.BCRYPT_SALT));
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
    async activateLecturer({ email, password, tokenString }) {
        const foundLecturer = await this.findLecturer(email);
        if (!foundLecturer)
            throw new common_1.UnauthorizedException(`Lecturer not found`);
        if (foundLecturer.password)
            throw new common_1.BadRequestException(`Lecturer already activated`);
        const foundToken = await this.db.client.query.token.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.token.userId, foundLecturer.id), (0, drizzle_orm_1.eq)(schema_1.token.userRole, auth_schema_1.UserRole.LECTURER)),
        });
        if (!foundToken)
            throw new common_1.NotFoundException('Token not found');
        if (foundToken.tokenString !== tokenString ||
            foundToken.tokenType !== auth_schema_1.TokenType.ACTIVATE_ACCOUNT)
            throw new common_1.BadRequestException('Invalid or expired token');
        this.jwtService
            .verifyAsync(tokenString)
            .then(() => { })
            .catch(() => {
            throw new common_1.BadRequestException('Invalid or expired token');
        });
        const hashedPassword = await bcrypt.hash(password, Number(environment_1.env.BCRYPT_SALT));
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
        const accessToken = await this.generateToken({
            id: foundLecturer.id,
            role: auth_schema_1.UserRole.LECTURER,
        });
        return { accessToken };
    }
    async lecturerResetPasswordRequest(email) {
        const foundLecturer = await this.findLecturer(email);
        if (!foundLecturer)
            throw new common_1.NotFoundException(`Lecturer not found`);
        const tokenString = await this.generateToken({ id: foundLecturer.id, role: auth_schema_1.UserRole.ADMIN }, '15m');
        await this.db.client
            .insert(schema_1.token)
            .values({
            userId: foundLecturer.id,
            userRole: auth_schema_1.UserRole.LECTURER,
            tokenString,
            tokenType: auth_schema_1.TokenType.RESET_PASSWORD,
        })
            .onConflictDoUpdate({
            target: [schema_1.token.userId, schema_1.token.userRole],
            set: { tokenString, tokenType: auth_schema_1.TokenType.RESET_PASSWORD },
        });
        await this.emailQueueService.send({
            subject: 'Reset Password',
            toEmail: foundLecturer.email,
            htmlContent: (0, email_queue_schema_1.ResetPasswordTemplate)({
                name: `${foundLecturer.firstName} ${foundLecturer.lastName}`,
                resetLink: `${environment_1.env.FRONTEND_BASE_URL}/lecturer/reset-password/?token=${tokenString}`,
            }),
        });
        return { success: true, message: `Reset link sent to ${email}` };
    }
    async lecturerResetPassword({ email, password, tokenString, }) {
        const foundLecturer = await this.findLecturer(email);
        if (!foundLecturer)
            throw new common_1.NotFoundException(`Lecturer not found`);
        const foundToken = await this.db.client.query.token.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.token.userId, foundLecturer.id), (0, drizzle_orm_1.eq)(schema_1.token.userRole, auth_schema_1.UserRole.LECTURER)),
        });
        if (!foundToken)
            throw new common_1.NotFoundException('Token not found');
        if (foundToken.tokenString !== tokenString ||
            foundToken.tokenType !== auth_schema_1.TokenType.RESET_PASSWORD)
            throw new common_1.BadRequestException('Invalid or expired token');
        this.jwtService
            .verifyAsync(tokenString)
            .then(() => { })
            .catch(() => {
            throw new common_1.BadRequestException('Invalid or expired token');
        });
        const hashedPassword = await bcrypt.hash(password, Number(environment_1.env.BCRYPT_SALT));
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
    async activateStudent({ studentIdentifier, identifierType, password, tokenString, }) {
        const foundStudent = await this.findStudent({
            studentIdentifier,
            identifierType,
        });
        if (foundStudent.password)
            throw new common_1.UnauthorizedException(`Student already activated`);
        const foundToken = await this.db.client.query.token.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.token.userId, foundStudent.id), (0, drizzle_orm_1.eq)(schema_1.token.userRole, auth_schema_1.UserRole.STUDENT)),
        });
        if (!foundToken)
            throw new common_1.NotFoundException('Token not found');
        if (foundToken.tokenString !== tokenString ||
            foundToken.tokenType !== auth_schema_1.TokenType.ACTIVATE_ACCOUNT)
            throw new common_1.BadRequestException('Invalid or expired token');
        this.jwtService
            .verifyAsync(tokenString)
            .then(() => { })
            .catch(() => {
            throw new common_1.BadRequestException('Invalid or expired token');
        });
        const hashedPassword = await bcrypt.hash(password, Number(environment_1.env.BCRYPT_SALT));
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
        const accessToken = await this.generateToken({
            id: foundStudent.id,
            role: auth_schema_1.UserRole.STUDENT,
        });
        return { accessToken };
    }
    async studentResetPasswordRequest({ studentIdentifier, identifierType, }) {
        const foundStudent = await this.findStudent({
            studentIdentifier,
            identifierType,
        });
        const tokenString = await this.generateToken({ id: foundStudent.id, role: auth_schema_1.UserRole.ADMIN }, '15m');
        await this.db.client
            .insert(schema_1.token)
            .values({
            userId: foundStudent.id,
            userRole: auth_schema_1.UserRole.LECTURER,
            tokenString,
            tokenType: auth_schema_1.TokenType.RESET_PASSWORD,
        })
            .onConflictDoUpdate({
            target: [schema_1.token.userId, schema_1.token.userRole],
            set: { tokenString, tokenType: auth_schema_1.TokenType.RESET_PASSWORD },
        });
        await this.emailQueueService.send({
            subject: 'Reset Password',
            toEmail: foundStudent.email,
            htmlContent: (0, email_queue_schema_1.ResetPasswordTemplate)({
                name: `${foundStudent.firstName} ${foundStudent.lastName}`,
                resetLink: `${environment_1.env.FRONTEND_BASE_URL}/student/reset-password/?token=${tokenString}`,
            }),
        });
        return {
            success: true,
            message: `Reset link sent to ${foundStudent.email}`,
        };
    }
    async studentResetPassword({ studentIdentifier, identifierType, password, tokenString, }) {
        const foundStudent = await this.findStudent({
            studentIdentifier,
            identifierType,
        });
        const foundToken = await this.db.client.query.token.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.token.userId, foundStudent.id), (0, drizzle_orm_1.eq)(schema_1.token.userRole, auth_schema_1.UserRole.STUDENT)),
        });
        if (!foundToken)
            throw new common_1.NotFoundException('Token not found');
        if (foundToken.tokenString !== tokenString ||
            foundToken.tokenType !== auth_schema_1.TokenType.RESET_PASSWORD)
            throw new common_1.BadRequestException('Invalid or expired token');
        this.jwtService
            .verifyAsync(tokenString)
            .then(() => { })
            .catch(() => {
            throw new common_1.BadRequestException('Invalid or expired token');
        });
        const hashedPassword = await bcrypt.hash(password, Number(environment_1.env.BCRYPT_SALT));
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