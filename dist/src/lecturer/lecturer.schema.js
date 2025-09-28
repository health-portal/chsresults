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
exports.LecturerProfileResponse = exports.UploadScoresResponse = exports.BatchStudentRegistrationResponse = exports.UploadScoreRow = exports.RegisterStudentRow = exports.EditScoreBody = exports.Scores = exports.RegisterStudentBody = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const csv_1 = require("../utils/csv");
class RegisterStudentBody {
    studentIdentifier;
    identifierType;
}
exports.RegisterStudentBody = RegisterStudentBody;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterStudentBody.prototype, "studentIdentifier", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterStudentBody.prototype, "identifierType", void 0);
class Scores {
    continuousAssessment;
    examination;
}
exports.Scores = Scores;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], Scores.prototype, "continuousAssessment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], Scores.prototype, "examination", void 0);
class EditScoreBody extends Scores {
}
exports.EditScoreBody = EditScoreBody;
class RegisterStudentRow {
    matricNumber;
    name;
}
exports.RegisterStudentRow = RegisterStudentRow;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterStudentRow.prototype, "matricNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterStudentRow.prototype, "name", void 0);
class UploadScoreRow extends Scores {
    matricNumber;
}
exports.UploadScoreRow = UploadScoreRow;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UploadScoreRow.prototype, "matricNumber", void 0);
class BatchStudentRegistrationResponse extends csv_1.ParseCsvData {
    registeredStudents;
    unregisteredStudents;
}
exports.BatchStudentRegistrationResponse = BatchStudentRegistrationResponse;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], BatchStudentRegistrationResponse.prototype, "registeredStudents", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], BatchStudentRegistrationResponse.prototype, "unregisteredStudents", void 0);
class UploadScoresResponse extends csv_1.ParseCsvData {
    studentsUploadedFor;
    studentsNotFound;
}
exports.UploadScoresResponse = UploadScoresResponse;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], UploadScoresResponse.prototype, "studentsUploadedFor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], UploadScoresResponse.prototype, "studentsNotFound", void 0);
class LecturerProfileResponse {
    id;
    createdAt;
    updatedAt;
    email;
    firstName;
    lastName;
    otherName;
    phone;
    departmentId;
}
exports.LecturerProfileResponse = LecturerProfileResponse;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LecturerProfileResponse.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], LecturerProfileResponse.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], LecturerProfileResponse.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LecturerProfileResponse.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LecturerProfileResponse.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LecturerProfileResponse.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LecturerProfileResponse.prototype, "otherName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LecturerProfileResponse.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LecturerProfileResponse.prototype, "departmentId", void 0);
//# sourceMappingURL=lecturer.schema.js.map