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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const auth_schema_1 = require("./auth.schema");
const admin_schema_1 = require("../admin/admin.schema");
const lecturer_schema_1 = require("../lecturer/lecturer.schema");
const student_schema_1 = require("../student/student.schema");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async activateAdmin(body) {
        return await this.authService.activateAdmin(body);
    }
    async signinAdmin(body) {
        return await this.authService.signinAdmin(body);
    }
    async adminResetPasswordRequest(email) {
        return await this.authService.adminResetPasswordRequest(email);
    }
    async adminResetPassword(body) {
        return await this.authService.adminResetPassword(body);
    }
    async activateLecturer(body) {
        return await this.authService.activateLecturer(body);
    }
    async signinLecturer(body) {
        return await this.authService.signinLecturer(body);
    }
    async lecturerResetPasswordRequest(email) {
        return await this.authService.lecturerResetPasswordRequest(email);
    }
    async lecturerResetPassword(body) {
        return await this.authService.lecturerResetPassword(body);
    }
    async activateStudent(body) {
        return this.authService.activateStudent(body);
    }
    async signinStudent(body) {
        return this.authService.signinStudent(body);
    }
    async studentResetPasswordRequest(body) {
        return await this.authService.studentResetPasswordRequest(body);
    }
    async studentResetPassword(body) {
        return await this.authService.studentResetPassword(body);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('admin/activate-account'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Verify admin account' }),
    (0, swagger_1.ApiBody)({ type: auth_schema_1.VerifyUserBody }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Admin account activated successfully',
        type: admin_schema_1.AdminProfileResponse,
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Admin already activated' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Admin not found' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_schema_1.VerifyUserBody]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "activateAdmin", null);
__decorate([
    (0, common_1.Post)('admin/signin'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Sign in admin' }),
    (0, swagger_1.ApiBody)({ type: auth_schema_1.SigninUserBody }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Admin signed in successfully',
        type: auth_schema_1.SigninResponse,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Admin not found or invalid credentials',
    }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Admin not activated' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_schema_1.SigninUserBody]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signinAdmin", null);
__decorate([
    (0, common_1.Post)('admin/reset-password/request'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Request admin password reset' }),
    (0, swagger_1.ApiQuery)({ name: 'email', type: String, required: true }),
    (0, swagger_1.ApiOkResponse)({ description: 'Reset link sent to admin email' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Admin not found' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request' }),
    __param(0, (0, common_1.Query)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "adminResetPasswordRequest", null);
__decorate([
    (0, common_1.Post)('admin/reset-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Reset admin password' }),
    (0, swagger_1.ApiBody)({ type: auth_schema_1.VerifyUserBody }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Admin password reset successfully',
        type: admin_schema_1.AdminProfileResponse,
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Admin not found' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_schema_1.VerifyUserBody]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "adminResetPassword", null);
__decorate([
    (0, common_1.Post)('lecturer/activate-account'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Verify lecturer account' }),
    (0, swagger_1.ApiBody)({ type: auth_schema_1.VerifyUserBody }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Lecturer account activated successfully',
        type: lecturer_schema_1.LecturerProfileResponse,
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Lecturer already activated' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Lecturer not found' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_schema_1.VerifyUserBody]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "activateLecturer", null);
__decorate([
    (0, common_1.Post)('lecturer/signin'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Sign in lecturer' }),
    (0, swagger_1.ApiBody)({ type: auth_schema_1.SigninUserBody }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Lecturer signed in successfully',
        type: auth_schema_1.SigninResponse,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Lecturer not found or invalid credentials',
    }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Lecturer not activated' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_schema_1.SigninUserBody]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signinLecturer", null);
__decorate([
    (0, common_1.Post)('lecturer/reset-password/request'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Request lecturer password reset' }),
    (0, swagger_1.ApiQuery)({ name: 'email', type: String, required: true }),
    (0, swagger_1.ApiOkResponse)({ description: 'Reset link sent to lecturer email' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Lecturer not found' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request' }),
    __param(0, (0, common_1.Query)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "lecturerResetPasswordRequest", null);
__decorate([
    (0, common_1.Post)('lecturer/reset-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Reset lecturer password' }),
    (0, swagger_1.ApiBody)({ type: auth_schema_1.VerifyUserBody }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Lecturer password reset successfully',
        type: lecturer_schema_1.LecturerProfileResponse,
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Lecturer not found' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_schema_1.VerifyUserBody]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "lecturerResetPassword", null);
__decorate([
    (0, common_1.Post)('student/activate-account'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Verify student account' }),
    (0, swagger_1.ApiBody)({ type: auth_schema_1.VerifyStudentBody }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Student account activated successfully',
        type: student_schema_1.StudentProfileResponse,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Student already activated' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Student not found' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_schema_1.VerifyStudentBody]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "activateStudent", null);
__decorate([
    (0, common_1.Post)('student/signin'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Sign in student' }),
    (0, swagger_1.ApiBody)({ type: auth_schema_1.SigninStudentBody }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Student signed in successfully',
        type: auth_schema_1.SigninResponse,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Student not found or invalid credentials',
    }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Student not activated' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_schema_1.SigninStudentBody]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signinStudent", null);
__decorate([
    (0, common_1.Post)('student/reset-password/request'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Request student password reset' }),
    (0, swagger_1.ApiBody)({ type: auth_schema_1.StudentIdentifierBody }),
    (0, swagger_1.ApiOkResponse)({ description: 'Reset link sent to student email' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Student not found' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_schema_1.StudentIdentifierBody]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "studentResetPasswordRequest", null);
__decorate([
    (0, common_1.Post)('student/reset-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Reset student password' }),
    (0, swagger_1.ApiBody)({ type: auth_schema_1.VerifyStudentBody }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Student password reset successfully',
        type: student_schema_1.StudentProfileResponse,
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Student not found' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_schema_1.VerifyStudentBody]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "studentResetPassword", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map