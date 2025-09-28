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
exports.SigninResponse = exports.AuthStudentBody = exports.StudentIdentifierBody = exports.StudentIdentifierType = exports.AuthUserBody = exports.UserRole = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "Admin";
    UserRole["LECTURER"] = "Lecturer";
    UserRole["STUDENT"] = "Student";
})(UserRole || (exports.UserRole = UserRole = {}));
class AuthUserBody {
    email;
    password;
}
exports.AuthUserBody = AuthUserBody;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AuthUserBody.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsStrongPassword)(),
    __metadata("design:type", String)
], AuthUserBody.prototype, "password", void 0);
var StudentIdentifierType;
(function (StudentIdentifierType) {
    StudentIdentifierType["EMAIL"] = "email";
    StudentIdentifierType["MATRIC_NUMBER"] = "matricNumber";
})(StudentIdentifierType || (exports.StudentIdentifierType = StudentIdentifierType = {}));
class StudentIdentifierBody {
    studentIdentifier;
    identifierType;
}
exports.StudentIdentifierBody = StudentIdentifierBody;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], StudentIdentifierBody.prototype, "studentIdentifier", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: StudentIdentifierType }),
    (0, class_validator_1.IsEnum)(StudentIdentifierType),
    __metadata("design:type", String)
], StudentIdentifierBody.prototype, "identifierType", void 0);
class AuthStudentBody extends StudentIdentifierBody {
    password;
}
exports.AuthStudentBody = AuthStudentBody;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AuthStudentBody.prototype, "password", void 0);
class SigninResponse {
    accessToken;
}
exports.SigninResponse = SigninResponse;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SigninResponse.prototype, "accessToken", void 0);
//# sourceMappingURL=auth.schema.js.map