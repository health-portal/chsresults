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
exports.CreateStudentsResponse = exports.CreateStudentResponse = exports.UpdateStudentBody = exports.CreateStudentBody = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const csv_1 = require("../utils/csv");
class CreateStudentBody {
    email;
    matricNumber;
    firstName;
    lastName;
    otherName;
    department;
}
exports.CreateStudentBody = CreateStudentBody;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateStudentBody.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateStudentBody.prototype, "matricNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateStudentBody.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateStudentBody.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStudentBody.prototype, "otherName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateStudentBody.prototype, "department", void 0);
class UpdateStudentBody extends (0, mapped_types_1.OmitType)((0, mapped_types_1.PartialType)(CreateStudentBody), ['email', 'matricNumber']) {
}
exports.UpdateStudentBody = UpdateStudentBody;
class CreateStudentResponse extends CreateStudentBody {
    isCreated;
}
exports.CreateStudentResponse = CreateStudentResponse;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], CreateStudentResponse.prototype, "isCreated", void 0);
class CreateStudentsResponse extends csv_1.ParseCsvData {
    students;
}
exports.CreateStudentsResponse = CreateStudentsResponse;
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => [CreateStudentResponse] }),
    __metadata("design:type", Array)
], CreateStudentsResponse.prototype, "students", void 0);
//# sourceMappingURL=students.schema.js.map