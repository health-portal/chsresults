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
exports.StudentsController = void 0;
const common_1 = require("@nestjs/common");
const students_service_1 = require("./students.service");
const auth_schema_1 = require("../auth/auth.schema");
const role_guard_1 = require("../auth/role.guard");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const students_schema_1 = require("./students.schema");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const student_schema_1 = require("../student/student.schema");
let StudentsController = class StudentsController {
    studentsService;
    constructor(studentsService) {
        this.studentsService = studentsService;
    }
    async createStudent(body) {
        return await this.studentsService.createStudent(body);
    }
    async createStudents(file) {
        return await this.studentsService.createStudents(file);
    }
    async getStudents() {
        return await this.studentsService.getStudents();
    }
    async updateStudent(studentId, body) {
        return await this.studentsService.updateStudent(studentId, body);
    }
    async deleteStudent(studentId) {
        return await this.studentsService.deleteStudent(studentId);
    }
};
exports.StudentsController = StudentsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new student' }),
    (0, swagger_1.ApiBody)({ type: () => students_schema_1.CreateStudentBody }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Student created successfully',
        type: () => student_schema_1.StudentProfileResponse,
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Forbidden' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [students_schema_1.CreateStudentBody]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "createStudent", null);
__decorate([
    (0, common_1.Post)('batch'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({ summary: 'Create multiple students via file upload' }),
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
        description: 'Students created successfully',
        type: () => students_schema_1.CreateStudentsResponse,
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
], StudentsController.prototype, "createStudents", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all students' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Students retrieved successfully',
        type: () => [student_schema_1.StudentProfileResponse],
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Forbidden' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "getStudents", null);
__decorate([
    (0, common_1.Patch)(':studentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a student' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'Student UUID' }),
    (0, swagger_1.ApiBody)({ type: () => students_schema_1.UpdateStudentBody }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Student updated successfully',
        type: () => student_schema_1.StudentProfileResponse,
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Bad Request' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Student not found' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('studentId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, students_schema_1.UpdateStudentBody]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "updateStudent", null);
__decorate([
    (0, common_1.Delete)(':studentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a student' }),
    (0, swagger_1.ApiParam)({ name: 'studentId', type: String, description: 'Student UUID' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Student deleted successfully',
        type: () => student_schema_1.StudentProfileResponse,
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Student not found' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "deleteStudent", null);
exports.StudentsController = StudentsController = __decorate([
    (0, swagger_1.ApiTags)('Students', 'Admin'),
    (0, swagger_1.ApiBearerAuth)('accessToken'),
    (0, common_1.Controller)('students'),
    (0, role_guard_1.Role)(auth_schema_1.UserRole.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard),
    __metadata("design:paramtypes", [students_service_1.StudentsService])
], StudentsController);
//# sourceMappingURL=students.controller.js.map