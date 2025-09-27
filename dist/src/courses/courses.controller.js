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
exports.CoursesController = void 0;
const common_1 = require("@nestjs/common");
const courses_service_1 = require("./courses.service");
const platform_express_1 = require("@nestjs/platform-express");
const courses_schema_1 = require("./courses.schema");
const swagger_1 = require("@nestjs/swagger");
const role_guard_1 = require("../auth/role.guard");
const auth_schema_1 = require("../auth/auth.schema");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let CoursesController = class CoursesController {
    coursesService;
    constructor(coursesService) {
        this.coursesService = coursesService;
    }
    async createCourse(body) {
        return await this.coursesService.createCourse(body);
    }
    async createCourses(file) {
        return await this.coursesService.createCourses(file);
    }
    async getCourses() {
        return await this.coursesService.getCourses();
    }
    async updateCourse(courseId, body) {
        return await this.coursesService.updateCourse(courseId, body);
    }
    async deleteCourse(courseId) {
        return await this.coursesService.deleteCourse(courseId);
    }
};
exports.CoursesController = CoursesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new course' }),
    (0, swagger_1.ApiBody)({ type: () => courses_schema_1.UpsertCourseBody }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Course created successfully',
        type: () => courses_schema_1.CourseResponse,
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [courses_schema_1.UpsertCourseBody]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "createCourse", null);
__decorate([
    (0, common_1.Post)('batch'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({ summary: 'Create multiple courses via file upload' }),
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
        description: 'Courses created successfully',
        type: () => courses_schema_1.CreateCoursesResponse,
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request' }),
    (0, swagger_1.ApiUnprocessableEntityResponse)({
        description: 'Invalid file or file size exceeds 5KB',
    }),
    __param(0, (0, common_1.UploadedFile)(new common_1.ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 5 * 1024 })
        .build({ errorHttpStatusCode: common_1.HttpStatus.UNPROCESSABLE_ENTITY }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "createCourses", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all courses' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Courses retrieved successfully',
        type: () => [courses_schema_1.CourseResponse],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getCourses", null);
__decorate([
    (0, common_1.Patch)(':courseId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a course' }),
    (0, swagger_1.ApiParam)({ name: 'courseId', type: String, description: 'Course ID' }),
    (0, swagger_1.ApiBody)({ type: () => courses_schema_1.UpsertCourseBody }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Course updated successfully',
        type: () => courses_schema_1.CourseResponse,
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Course not found' }),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, courses_schema_1.UpsertCourseBody]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "updateCourse", null);
__decorate([
    (0, common_1.Delete)(':courseId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a course' }),
    (0, swagger_1.ApiParam)({ name: 'courseId', type: String, description: 'Course ID' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Course deleted successfully',
        type: () => courses_schema_1.CourseResponse,
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Course not found' }),
    __param(0, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "deleteCourse", null);
exports.CoursesController = CoursesController = __decorate([
    (0, swagger_1.ApiTags)('Courses', 'Admin'),
    (0, swagger_1.ApiBearerAuth)('accessToken'),
    (0, common_1.Controller)('courses'),
    (0, role_guard_1.Role)(auth_schema_1.UserRole.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard),
    __metadata("design:paramtypes", [courses_service_1.CoursesService])
], CoursesController);
//# sourceMappingURL=courses.controller.js.map