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
exports.CollegeController = void 0;
const common_1 = require("@nestjs/common");
const college_service_1 = require("./college.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const role_guard_1 = require("../auth/role.guard");
const auth_schema_1 = require("../auth/auth.schema");
const swagger_1 = require("@nestjs/swagger");
const college_schema_1 = require("./college.schema");
let CollegeController = class CollegeController {
    collegeService;
    constructor(collegeService) {
        this.collegeService = collegeService;
    }
    async getDepartments() {
        return await this.collegeService.getDepartments();
    }
    async createFaculty(body) {
        return await this.collegeService.createFaculty(body);
    }
    async updateFaculty(facultyId, body) {
        return await this.collegeService.updateFaculty(facultyId, body);
    }
    async deleteFaculty(facultyId) {
        return await this.collegeService.deleteFaculty(facultyId);
    }
    async createDepartment(body) {
        return await this.collegeService.createDepartment(body);
    }
    async updateDepartment(deptId, body) {
        return await this.collegeService.updateDepartment(deptId, body);
    }
    async deleteDepartment(deptId) {
        return await this.collegeService.deleteDepartment(deptId);
    }
};
exports.CollegeController = CollegeController;
__decorate([
    (0, common_1.Get)('departments'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all faculties with departments' }),
    (0, swagger_1.ApiOkResponse)({ type: [college_schema_1.GetDepartmentsResponse] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CollegeController.prototype, "getDepartments", null);
__decorate([
    (0, common_1.Post)('faculties'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a faculty' }),
    (0, swagger_1.ApiBody)({ type: college_schema_1.UpsertFacultyAndDepartmentBody }),
    (0, swagger_1.ApiCreatedResponse)({ type: college_schema_1.FacultyResponse }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [college_schema_1.UpsertFacultyAndDepartmentBody]),
    __metadata("design:returntype", Promise)
], CollegeController.prototype, "createFaculty", null);
__decorate([
    (0, common_1.Patch)('faculties/:facultyId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update faculty name' }),
    (0, swagger_1.ApiParam)({ name: 'facultyId', type: String, description: 'Faculty UUID' }),
    (0, swagger_1.ApiBody)({ type: college_schema_1.UpsertFacultyAndDepartmentBody }),
    (0, swagger_1.ApiOkResponse)({ type: college_schema_1.FacultyResponse }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Faculty not found' }),
    __param(0, (0, common_1.Param)('facultyId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, college_schema_1.UpsertFacultyAndDepartmentBody]),
    __metadata("design:returntype", Promise)
], CollegeController.prototype, "updateFaculty", null);
__decorate([
    (0, common_1.Delete)('faculties/:facultyId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a faculty' }),
    (0, swagger_1.ApiParam)({ name: 'facultyId', type: String, description: 'Faculty UUID' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Faculty deleted successfully' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Faculty not found' }),
    __param(0, (0, common_1.Param)('facultyId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CollegeController.prototype, "deleteFaculty", null);
__decorate([
    (0, common_1.Post)('departments'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a department under a faculty' }),
    (0, swagger_1.ApiBody)({ type: college_schema_1.CreateDepartmentBody }),
    (0, swagger_1.ApiCreatedResponse)({ type: college_schema_1.DepartmentResponse }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [college_schema_1.CreateDepartmentBody]),
    __metadata("design:returntype", Promise)
], CollegeController.prototype, "createDepartment", null);
__decorate([
    (0, common_1.Patch)('departments/:deptId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update department name' }),
    (0, swagger_1.ApiParam)({ name: 'deptId', type: String, description: 'Department UUID' }),
    (0, swagger_1.ApiBody)({ type: college_schema_1.UpsertFacultyAndDepartmentBody }),
    (0, swagger_1.ApiOkResponse)({ type: college_schema_1.DepartmentResponse }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Department not found' }),
    __param(0, (0, common_1.Param)('deptId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, college_schema_1.UpsertFacultyAndDepartmentBody]),
    __metadata("design:returntype", Promise)
], CollegeController.prototype, "updateDepartment", null);
__decorate([
    (0, common_1.Delete)('departments/:deptId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a department' }),
    (0, swagger_1.ApiParam)({ name: 'deptId', type: String, description: 'Department UUID' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Department deleted successfully' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Department not found' }),
    __param(0, (0, common_1.Param)('deptId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CollegeController.prototype, "deleteDepartment", null);
exports.CollegeController = CollegeController = __decorate([
    (0, swagger_1.ApiTags)('College', 'Admin'),
    (0, swagger_1.ApiBearerAuth)('accessToken'),
    (0, common_1.Controller)('college'),
    (0, role_guard_1.Role)(auth_schema_1.UserRole.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard),
    __metadata("design:paramtypes", [college_service_1.CollegeService])
], CollegeController);
//# sourceMappingURL=college.controller.js.map