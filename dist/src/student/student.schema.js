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
exports.StudentEnrollmentResponse = exports.ChangePasswordBody = exports.StudentProfileResponse = exports.Gender = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const college_schema_1 = require("../college/college.schema");
var Gender;
(function (Gender) {
    Gender["MALE"] = "male";
    Gender["FEMALE"] = "female";
})(Gender || (exports.Gender = Gender = {}));
class StudentProfileResponse {
    id;
    createdAt;
    updatedAt;
    email;
    matricNumber;
    firstName;
    lastName;
    otherName;
    level;
    gender;
    degree;
    departmentId;
    department;
}
exports.StudentProfileResponse = StudentProfileResponse;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], StudentProfileResponse.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], StudentProfileResponse.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], StudentProfileResponse.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], StudentProfileResponse.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], StudentProfileResponse.prototype, "matricNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], StudentProfileResponse.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], StudentProfileResponse.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ nullable: true }),
    __metadata("design:type", Object)
], StudentProfileResponse.prototype, "otherName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], StudentProfileResponse.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: Gender }),
    __metadata("design:type", String)
], StudentProfileResponse.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], StudentProfileResponse.prototype, "degree", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], StudentProfileResponse.prototype, "departmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: college_schema_1.DepartmentResponse, required: false }),
    __metadata("design:type", college_schema_1.DepartmentResponse)
], StudentProfileResponse.prototype, "department", void 0);
class ChangePasswordBody {
    currentPassword;
    newPassword;
}
exports.ChangePasswordBody = ChangePasswordBody;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ChangePasswordBody.prototype, "currentPassword", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsStrongPassword)(),
    __metadata("design:type", String)
], ChangePasswordBody.prototype, "newPassword", void 0);
class StudentEnrollmentResponse {
}
exports.StudentEnrollmentResponse = StudentEnrollmentResponse;
//# sourceMappingURL=student.schema.js.map