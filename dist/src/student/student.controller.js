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
const swagger_1 = require("@nestjs/swagger");
const courses_schema_1 = require("../courses/courses.schema");
const student_schema_1 = require("./student.schema");
const email_queue_service_1 = require("../email-queue/email-queue.service");
let StudentController = class StudentController {
    studentService;
    emailService;
    constructor(studentService, emailService) {
        this.studentService = studentService;
        this.emailService = emailService;
    }
    async testQueue() {
        await this.emailService.enqueueEmails([
            {
                title: 'Test Email',
                message: 'This is a test email from the queue system.',
                portalLink: 'http://example.com/portal',
                name: 'John Doe',
                email: 'john.doe@example.com',
            },
            {
                title: 'Test Email',
                message: 'This is a test email from the queue system.',
                portalLink: 'http://example.com/portal',
                name: 'John Doe',
                email: 'john.dohe@example.com',
            },
            {
                title: 'Test Email',
                message: 'This is a test email from the queue system.',
                portalLink: 'http://example.com/portal',
                name: 'John Doe',
                email: 'john.de@example.com',
            },
            {
                title: 'Test Email',
                message: 'This is a test email from the queue system.',
                portalLink: 'http://example.com/portal',
                name: 'John Doe',
                email: 'olugbengamoyinoluwa839@gmail.com',
            },
        ]);
        return await this.emailService.processQueue();
    }
    async changePassword(studentId, body) {
        return await this.studentService.changePassword(studentId, body);
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
    (0, common_1.Post)('test'),
    (0, swagger_1.ApiOperation)({ summary: 'Change student password' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Password updated successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StudentController.prototype, "testQueue", null);
__decorate([
    (0, common_1.Post)('change-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Change student password' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Password updated successfully' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Forbidden' }),
    __param(0, (0, user_decorator_1.User)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, student_schema_1.ChangePasswordBody]),
    __metadata("design:returntype", Promise)
], StudentController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Get)('enrollments'),
    (0, swagger_1.ApiOperation)({ summary: 'List all enrollments for the student' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Enrollments retrieved successfully',
        type: [courses_schema_1.EnrollmentResponse],
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
    (0, swagger_1.ApiOkResponse)({ description: 'Enrollment retrieved successfully' }),
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
        type: student_schema_1.StudentProfileResponse,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Forbidden' }),
    __param(0, (0, user_decorator_1.User)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentController.prototype, "getProfile", null);
exports.StudentController = StudentController = __decorate([
    (0, common_1.Controller)('student'),
    __metadata("design:paramtypes", [student_service_1.StudentService,
        email_queue_service_1.EmailQueueService])
], StudentController);
//# sourceMappingURL=student.controller.js.map