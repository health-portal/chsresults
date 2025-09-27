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
exports.EnrollmentResponse = exports.CourseResponse = exports.CreateCoursesResponse = exports.CreateCourseResponse = exports.UpsertCourseBody = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const lecturer_schema_1 = require("../lecturer/lecturer.schema");
const csv_1 = require("../utils/csv");
class UpsertCourseBody {
    code;
    title;
    lecturerEmail;
}
exports.UpsertCourseBody = UpsertCourseBody;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpsertCourseBody.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpsertCourseBody.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpsertCourseBody.prototype, "lecturerEmail", void 0);
class CreateCourseResponse extends UpsertCourseBody {
    isCreated;
}
exports.CreateCourseResponse = CreateCourseResponse;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], CreateCourseResponse.prototype, "isCreated", void 0);
class CreateCoursesResponse extends csv_1.ParseCsvData {
    courses;
}
exports.CreateCoursesResponse = CreateCoursesResponse;
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => [CreateCourseResponse] }),
    __metadata("design:type", Array)
], CreateCoursesResponse.prototype, "courses", void 0);
class CourseResponse {
    id;
    code;
    title;
    lecturerId;
}
exports.CourseResponse = CourseResponse;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CourseResponse.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CourseResponse.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CourseResponse.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CourseResponse.prototype, "lecturerId", void 0);
class EnrollmentResponse {
    id;
    scores;
    courseId;
    studentId;
}
exports.EnrollmentResponse = EnrollmentResponse;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EnrollmentResponse.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", lecturer_schema_1.Scores)
], EnrollmentResponse.prototype, "scores", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EnrollmentResponse.prototype, "courseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EnrollmentResponse.prototype, "studentId", void 0);
//# sourceMappingURL=courses.schema.js.map