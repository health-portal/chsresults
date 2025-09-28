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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDepartmentsResponse = exports.DepartmentResponse = exports.FacultyResponse = exports.CreateDepartmentBody = exports.UpsertFacultyAndDepartmentBody = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpsertFacultyAndDepartmentBody {
    name;
}
exports.UpsertFacultyAndDepartmentBody = UpsertFacultyAndDepartmentBody;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpsertFacultyAndDepartmentBody.prototype, "name", void 0);
class CreateDepartmentBody extends UpsertFacultyAndDepartmentBody {
    facultyId;
}
exports.CreateDepartmentBody = CreateDepartmentBody;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateDepartmentBody.prototype, "facultyId", void 0);
class FacultyResponse {
    id;
    name;
    createdAt;
    updatedAt;
}
exports.FacultyResponse = FacultyResponse;
class DepartmentResponse extends FacultyResponse {
    facultyId;
}
exports.DepartmentResponse = DepartmentResponse;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DepartmentResponse.prototype, "facultyId", void 0);
class GetDepartmentsResponse extends FacultyResponse {
    departments;
}
exports.GetDepartmentsResponse = GetDepartmentsResponse;
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => [DepartmentResponse] }),
    __metadata("design:type", Array)
], GetDepartmentsResponse.prototype, "departments", void 0);
//# sourceMappingURL=college.schema.js.map