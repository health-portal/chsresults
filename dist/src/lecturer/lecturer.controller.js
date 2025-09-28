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
exports.LecturerController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const lecturer_service_1 = require("./lecturer.service");
const user_decorator_1 = require("../auth/user.decorator");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const role_guard_1 = require("../auth/role.guard");
const lecturer_schema_1 = require("./lecturer.schema");
const auth_schema_1 = require("../auth/auth.schema");
const swagger_1 = require("@nestjs/swagger");
const courses_schema_1 = require("../courses/courses.schema");
let LecturerController = class LecturerController {
    lecturerService;
    constructor(lecturerService) {
        this.lecturerService = lecturerService;
    }
    async listCourses(lecturerId) {
        return await this.lecturerService.listCourses(lecturerId);
    }
    async registerStudentsBatch(lecturerId, courseId, file) {
        return await this.lecturerService.registerStudentsBatch(lecturerId, courseId, file);
    }
    async registerStudent(lecturerId, courseId, body) {
        return await this.lecturerService.registerStudent(lecturerId, courseId, body);
    }
    async uploadScores(lecturerId, courseId, file) {
        return await this.lecturerService.uploadScores(lecturerId, courseId, file);
    }
    async editScore(lecturerId, courseId, studentId, body) {
        return await this.lecturerService.editScore(lecturerId, courseId, studentId, body);
    }
    async viewCourseScores(lecturerId, courseId) {
        return await this.lecturerService.viewCourseScores(lecturerId, courseId);
    }
    async listCourseStudents(lecturerId, courseId) {
        return await this.lecturerService.listCourseStudents(lecturerId, courseId);
    }
    async getProfile(lecturerId) {
        return await this.lecturerService.getProfile(lecturerId);
    }
};
exports.LecturerController = LecturerController;
__decorate([
    (0, common_1.Get)('courses'),
    (0, swagger_1.ApiOperation)({ summary: 'List courses assigned to the lecturer' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Courses retrieved successfully',
        type: () => [courses_schema_1.CourseResponse],
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Forbidden' }),
    __param(0, (0, user_decorator_1.User)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LecturerController.prototype, "listCourses", null);
__decorate([
    (0, common_1.Post)('courses/:courseId/students/batch'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({
        summary: 'Register multiple students to a course via file upload',
    }),
    (0, swagger_1.ApiParam)({ name: 'courseId', type: String, description: 'Course UUID' }),
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
        description: 'Students registered successfully',
        type: () => lecturer_schema_1.BatchStudentRegistrationResponse,
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Course not found' }),
    (0, swagger_1.ApiUnprocessableEntityResponse)({
        description: 'Invalid file or file size exceeds 5KB',
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Forbidden' }),
    __param(0, (0, user_decorator_1.User)('id')),
    __param(1, (0, common_1.Param)('courseId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.UploadedFile)(new common_1.ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 5 * 1024 })
        .build({ errorHttpStatusCode: common_1.HttpStatus.UNPROCESSABLE_ENTITY }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], LecturerController.prototype, "registerStudentsBatch", null);
__decorate([
    (0, common_1.Post)('courses/:courseId/students'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a single student to a course' }),
    (0, swagger_1.ApiParam)({ name: 'courseId', type: String, description: 'Course UUID' }),
    (0, swagger_1.ApiBody)({ type: () => lecturer_schema_1.RegisterStudentBody }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Student registered successfully',
        type: () => courses_schema_1.EnrollmentResponse,
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Course not found' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Forbidden' }),
    __param(0, (0, user_decorator_1.User)('id')),
    __param(1, (0, common_1.Param)('courseId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, lecturer_schema_1.RegisterStudentBody]),
    __metadata("design:returntype", Promise)
], LecturerController.prototype, "registerStudent", null);
__decorate([
    (0, common_1.Post)('courses/:courseId/scores'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({ summary: 'Upload scores for a course' }),
    (0, swagger_1.ApiParam)({ name: 'courseId', type: String, description: 'Course UUID' }),
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
        description: 'Scores uploaded successfully',
        type: () => lecturer_schema_1.UploadScoresResponse,
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Course not found' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Forbidden' }),
    __param(0, (0, user_decorator_1.User)('id')),
    __param(1, (0, common_1.Param)('courseId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], LecturerController.prototype, "uploadScores", null);
__decorate([
    (0, common_1.Patch)('courses/:courseId/scores/:studentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Edit a student’s score for a course' }),
    (0, swagger_1.ApiParam)({ name: 'courseId', type: String, description: 'Course UUID' }),
    (0, swagger_1.ApiParam)({ name: 'studentId', type: String, description: 'Student UUID' }),
    (0, swagger_1.ApiBody)({ type: () => lecturer_schema_1.EditScoreBody }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Score updated successfully',
        type: () => courses_schema_1.EnrollmentResponse,
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Course or student not found' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Forbidden' }),
    __param(0, (0, user_decorator_1.User)('id')),
    __param(1, (0, common_1.Param)('courseId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Param)('studentId', common_1.ParseUUIDPipe)),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, lecturer_schema_1.EditScoreBody]),
    __metadata("design:returntype", Promise)
], LecturerController.prototype, "editScore", null);
__decorate([
    (0, common_1.Get)('courses/:courseId/scores'),
    (0, swagger_1.ApiOperation)({ summary: 'View scores for a course' }),
    (0, swagger_1.ApiParam)({ name: 'courseId', type: String, description: 'Course UUID' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Course scores retrieved successfully',
        type: () => [courses_schema_1.EnrollmentResponse],
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Course not found' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Forbidden' }),
    __param(0, (0, user_decorator_1.User)('id')),
    __param(1, (0, common_1.Param)('courseId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LecturerController.prototype, "viewCourseScores", null);
__decorate([
    (0, common_1.Get)('courses/:courseId/students'),
    (0, swagger_1.ApiOperation)({ summary: 'List students enrolled in a course' }),
    (0, swagger_1.ApiParam)({ name: 'courseId', type: String, description: 'Course UUID' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Course students retrieved successfully',
        type: () => [courses_schema_1.EnrollmentResponse],
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Course not found' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Forbidden' }),
    __param(0, (0, user_decorator_1.User)('id')),
    __param(1, (0, common_1.Param)('courseId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LecturerController.prototype, "listCourseStudents", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Get lecturer profile' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Profile retrieved successfully',
        type: () => lecturer_schema_1.LecturerProfileResponse,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Forbidden' }),
    __param(0, (0, user_decorator_1.User)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LecturerController.prototype, "getProfile", null);
exports.LecturerController = LecturerController = __decorate([
    (0, swagger_1.ApiTags)('Lecturer'),
    (0, swagger_1.ApiBearerAuth)('accessToken'),
    (0, common_1.Controller)('lecturer'),
    (0, role_guard_1.Role)(auth_schema_1.UserRole.LECTURER),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard),
    __metadata("design:paramtypes", [lecturer_service_1.LecturerService])
], LecturerController);
//# sourceMappingURL=lecturer.controller.js.map