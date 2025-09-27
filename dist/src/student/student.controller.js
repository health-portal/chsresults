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
exports.StudentController = void 0;
const common_1 = require("@nestjs/common");
const student_service_1 = require("./student.service");
const user_decorator_1 = require("../auth/user.decorator");
const role_guard_1 = require("../auth/role.guard");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const auth_schema_1 = require("../auth/auth.schema");
const swagger_1 = require("@nestjs/swagger");
const courses_schema_1 = require("../courses/courses.schema");
let StudentController = class StudentController {
    studentService;
    constructor(studentService) {
        this.studentService = studentService;
    }
    async listEnrollments(studentId) {
        return await this.studentService.listEnrollments(studentId);
    }
    async listEnrollment(studentId, enrollmentId) {
        return await this.studentService.listEnrollment(studentId, enrollmentId);
    }
    async getProfile(studentId) {
        return await this.studentService.getProfile(studentId);
    }
};
exports.StudentController = StudentController;
__decorate([
    (0, common_1.Get)('enrollments'),
    (0, swagger_1.ApiOperation)({ summary: 'List all enrollments for the student' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Enrollments retrieved successfully',
        type: () => [courses_schema_1.EnrollmentResponse],
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Forbidden' }),
    __param(0, (0, user_decorator_1.User)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentController.prototype, "listEnrollments", null);
__decorate([
    (0, common_1.Get)('enrollments/:enrollmentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get details of a specific enrollment' }),
    (0, swagger_1.ApiParam)({
        name: 'enrollmentId',
        type: String,
        description: 'Enrollment ID',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Enrollment retrieved successfully',
        type: () => courses_schema_1.EnrollmentResponse,
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Enrollment not found' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Forbidden' }),
    __param(0, (0, user_decorator_1.User)('id')),
    __param(1, (0, common_1.Param)('enrollmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], StudentController.prototype, "listEnrollment", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Get student profile' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Profile retrieved successfully',
        type: () => auth_schema_1.StudentProfileResponse,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Forbidden' }),
    __param(0, (0, user_decorator_1.User)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentController.prototype, "getProfile", null);
exports.StudentController = StudentController = __decorate([
    (0, swagger_1.ApiTags)('Student'),
    (0, swagger_1.ApiBearerAuth)('accessToken'),
    (0, common_1.Controller)('student'),
    (0, role_guard_1.Role)(auth_schema_1.UserRole.STUDENT),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard),
    __metadata("design:paramtypes", [student_service_1.StudentService])
], StudentController);
//# sourceMappingURL=student.controller.js.map