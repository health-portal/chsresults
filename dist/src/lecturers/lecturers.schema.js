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
exports.CreateLecturersResponse = exports.CreateLecturerResponse = exports.UpdateLecturerBody = exports.CreateLecturerBody = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const csv_1 = require("../utils/csv");
class CreateLecturerBody {
    email;
    firstName;
    lastName;
    otherName;
    phone;
    department;
    title;
}
exports.CreateLecturerBody = CreateLecturerBody;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateLecturerBody.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLecturerBody.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLecturerBody.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLecturerBody.prototype, "otherName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLecturerBody.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLecturerBody.prototype, "department", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateLecturerBody.prototype, "title", void 0);
class UpdateLecturerBody extends (0, mapped_types_1.OmitType)((0, swagger_1.PartialType)(CreateLecturerBody), ['email']) {
}
exports.UpdateLecturerBody = UpdateLecturerBody;
class CreateLecturerResponse extends CreateLecturerBody {
    isCreated;
}
exports.CreateLecturerResponse = CreateLecturerResponse;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], CreateLecturerResponse.prototype, "isCreated", void 0);
class CreateLecturersResponse extends csv_1.ParseCsvData {
    lecturers;
}
exports.CreateLecturersResponse = CreateLecturersResponse;
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => [CreateLecturerResponse] }),
    __metadata("design:type", Array)
], CreateLecturersResponse.prototype, "lecturers", void 0);
//# sourceMappingURL=lecturers.schema.js.map