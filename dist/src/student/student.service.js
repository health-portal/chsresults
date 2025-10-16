"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../../drizzle/schema");
const database_service_1 = require("../database/database.service");
const bcrypt = __importStar(require("bcrypt"));
const environment_1 = require("../environment");
let StudentService = class StudentService {
    db;
    constructor(db) {
        this.db = db;
    }
    async changePassword(studentId, { currentPassword, newPassword }) {
        const foundStudent = await this.db.client.query.student.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.student.id, studentId),
            with: { department: true },
        });
        if (!foundStudent)
            throw new common_1.UnauthorizedException('Student not found');
        if (!foundStudent.password)
            throw new common_1.UnauthorizedException('Student not activated');
        const isMatched = await bcrypt.compare(currentPassword, foundStudent.password);
        if (!isMatched)
            throw new common_1.BadRequestException('Current password incorrect');
        const hashedNewPassword = await bcrypt.hash(newPassword, Number(environment_1.env.BCRYPT_SALT));
        await this.db.client
            .update(schema_1.student)
            .set({ password: hashedNewPassword })
            .returning();
        return { success: true, message: 'Password updated' };
    }
    async listEnrollments(studentId) {
        return await this.db.client.query.enrollment.findMany({
            where: (0, drizzle_orm_1.eq)(schema_1.enrollment.studentId, studentId),
            with: {
                student: {
                    with: {
                        department: {
                            with: {
                                faculty: true,
                            },
                        },
                    },
                },
                course: {
                    columns: {
                        code: true,
                        description: true,
                        title: true,
                        semester: true,
                        units: true,
                    },
                    with: {
                        lecturer: {
                            with: {
                                department: {
                                    with: {
                                        faculty: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            orderBy: (enrollment, { asc }) => [asc(enrollment.session)],
        });
    }
    async listEnrollment(studentId, enrollmentId) {
        const foundEnrollment = await this.db.client.query.enrollment.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.enrollment.studentId, studentId), (0, drizzle_orm_1.eq)(schema_1.enrollment.id, enrollmentId)),
        });
        if (!foundEnrollment)
            throw new common_1.NotFoundException('Enrollment not found');
        return foundEnrollment;
    }
    async getProfile(studentId) {
        const foundStudent = await this.db.client.query.student.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.student.id, studentId),
            with: { department: true },
        });
        if (!foundStudent)
            throw new common_1.UnauthorizedException('Student not found');
        const { password: _, ...studentProfile } = foundStudent;
        return studentProfile;
    }
};
exports.StudentService = StudentService;
exports.StudentService = StudentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], StudentService);
//# sourceMappingURL=student.service.js.map