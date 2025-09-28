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
exports.LecturersController = void 0;
const common_1 = require("@nestjs/common");
const lecturers_service_1 = require("./lecturers.service");
const auth_schema_1 = require("../auth/auth.schema");
const role_guard_1 = require("../auth/role.guard");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const platform_express_1 = require("@nestjs/platform-express");
const lecturers_schema_1 = require("./lecturers.schema");
const swagger_1 = require("@nestjs/swagger");
const lecturer_schema_1 = require("../lecturer/lecturer.schema");
let LecturersController = class LecturersController {
    lecturersService;
    constructor(lecturersService) {
        this.lecturersService = lecturersService;
    }
    async createLecturer(body) {
        return await this.lecturersService.createLecturer(body);
    }
    async createLecturers(file) {
        return await this.lecturersService.createLecturers(file);
    }
    async getLecturers() {
        return await this.lecturersService.getLecturers();
    }
    async updateLecturer(lecturerId, body) {
        return await this.lecturersService.updateLecturer(lecturerId, body);
    }
    async deleteLecturer(lecturerId) {
        return await this.lecturersService.deleteLecturer(lecturerId);
    }
};
exports.LecturersController = LecturersController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new lecturer' }),
    (0, swagger_1.ApiBody)({ type: () => lecturers_schema_1.CreateLecturerBody }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Lecturer created successfully',
        type: () => lecturer_schema_1.LecturerProfileResponse,
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Forbidden' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [lecturers_schema_1.CreateLecturerBody]),
    __metadata("design:returntype", Promise)
], LecturersController.prototype, "createLecturer", null);
__decorate([
    (0, common_1.Post)('batch'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({ summary: 'Create multiple lecturers via file upload' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Lecturers created successfully',
        type: () => lecturers_schema_1.CreateLecturersResponse,
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request' }),
    (0, swagger_1.ApiUnprocessableEntityResponse)({
        description: 'Invalid file or file size exceeds 5KB',
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Forbidden' }),
    __param(0, (0, common_1.UploadedFile)(new common_1.ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 5 * 1024 })
        .build({ errorHttpStatusCode: common_1.HttpStatus.UNPROCESSABLE_ENTITY }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LecturersController.prototype, "createLecturers", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all lecturers' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Lecturers retrieved successfully',
        type: () => [lecturer_schema_1.LecturerProfileResponse],
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Forbidden' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LecturersController.prototype, "getLecturers", null);
__decorate([
    (0, common_1.Patch)(':lecturerId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a lecturer' }),
    (0, swagger_1.ApiParam)({ name: 'lecturerId', type: String, description: 'Lecturer UUID' }),
    (0, swagger_1.ApiBody)({ type: () => lecturers_schema_1.UpdateLecturerBody }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Lecturer updated successfully',
        type: () => lecturer_schema_1.LecturerProfileResponse,
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Lecturer not found' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('lecturerId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, lecturers_schema_1.UpdateLecturerBody]),
    __metadata("design:returntype", Promise)
], LecturersController.prototype, "updateLecturer", null);
__decorate([
    (0, common_1.Delete)(':lecturerId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a lecturer' }),
    (0, swagger_1.ApiParam)({ name: 'lecturerId', type: String, description: 'Lecturer UUID' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Lecturer deleted successfully',
        type: () => lecturer_schema_1.LecturerProfileResponse,
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Lecturer not found' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('lecturerId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LecturersController.prototype, "deleteLecturer", null);
exports.LecturersController = LecturersController = __decorate([
    (0, swagger_1.ApiTags)('Lecturers', 'Admin'),
    (0, swagger_1.ApiBearerAuth)('accessToken'),
    (0, common_1.Controller)('lecturers'),
    (0, role_guard_1.Role)(auth_schema_1.UserRole.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard),
    __metadata("design:paramtypes", [lecturers_service_1.LecturersService])
], LecturersController);
//# sourceMappingURL=lecturers.controller.js.map