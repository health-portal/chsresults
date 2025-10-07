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
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const pg_1 = require("pg");
const schema = __importStar(require("../../drizzle/schema"));
const environment_1 = require("../environment");
const uuid_1 = require("uuid");
const drizzle_orm_1 = require("drizzle-orm");
const email_queue_service_1 = require("../email-queue/email-queue.service");
const email_queue_schema_1 = require("../email-queue/email-queue.schema");
const jwt_1 = require("@nestjs/jwt");
const auth_schema_1 = require("../auth/auth.schema");
let DatabaseService = class DatabaseService {
    emailQueueService;
    jwtService;
    constructor(emailQueueService, jwtService) {
        this.emailQueueService = emailQueueService;
        this.jwtService = jwtService;
    }
    pool = new pg_1.Pool({ connectionString: environment_1.env.DATABASE_URL });
    client = (0, node_postgres_1.drizzle)(this.pool, {
        schema,
    });
    async onModuleInit() {
        if (environment_1.env.AUTO_SEED) {
            await this.seed();
        }
    }
    async onModuleDestroy() {
        await this.pool.end();
    }
    async generateToken(payload, expiresIn = '7d') {
        const token = await this.jwtService.signAsync(payload, { expiresIn });
        return token;
    }
    async seed() {
        console.log('Starting database seed...');
        const defaultAdmins = environment_1.env.DEFAULT_ADMINS;
        console.log(`Seeding ${defaultAdmins.length} admin(s)...`);
        const insertedAdmins = await this.client
            .insert(schema.admin)
            .values(defaultAdmins.map((admin) => ({
            id: (0, uuid_1.v4)(),
            role: 'admin',
            ...admin,
        })))
            .onConflictDoNothing({ target: schema.admin.email })
            .returning();
        for (const admin of insertedAdmins) {
            const tokenString = await this.generateToken({
                id: admin.id,
                role: auth_schema_1.UserRole.ADMIN,
            });
            await this.client
                .insert(schema.token)
                .values({
                userId: admin.id,
                userRole: auth_schema_1.UserRole.ADMIN,
                tokenString,
                tokenType: auth_schema_1.TokenType.ACTIVATE_ACCOUNT,
            })
                .onConflictDoUpdate({
                target: [schema.token.userId, schema.token.userRole],
                set: { tokenString, tokenType: auth_schema_1.TokenType.ACTIVATE_ACCOUNT },
            });
            await this.emailQueueService.send({
                subject: 'Invitation to Activate Account',
                toEmail: admin.email,
                htmlContent: (0, email_queue_schema_1.InvitationTemplate)({
                    name: admin.name,
                    registrationLink: `${environment_1.env.FRONTEND_BASE_URL}/admin/activate/?token=${tokenString}`,
                }),
            });
        }
        console.log('Admins seeded');
        const collegeOfHealthSciences = {
            'Basic Medical Sciences': [
                'Anatomy and Cell Biology',
                'Chemical Pathology',
                'Haematology and Immunology',
                'Medical Biochemistry',
                'Medical Pharmacology and Therapeutics',
                'Department of Medical Rehabilitation',
                'Morbid Anatomy and Forensic Medicine',
                'Nursing Science',
                'Physiological Sciences',
            ],
            'Faculty of Clinical Sciences': [
                'Anaethesia and Intensive Care',
                'Community Health',
                'Dermatology and Venereology',
                'Medicine',
                'Mental Health',
                'Obstetrics, Gyanaecology and Perinatology',
                'Ophthalmology',
                'Orthopaedic Surgery and Traumatology',
                'Otorhinolaryngology',
                'Paediatrics and Child Health',
                'Radiology',
                'Surgery',
            ],
            Dentistry: [
                'Child Dental Health',
                'Oral or Maxillofacial Surgery',
                'Oral Medicine and Oral Pathology',
                'Preventive and Community Dentistry',
                'Restorative Dentistry',
            ],
        };
        console.log('Seeding faculties and departments...');
        await this.client.transaction(async (tx) => {
            for (const [facultyName, departments] of Object.entries(collegeOfHealthSciences)) {
                console.log(`Faculty: ${facultyName}`);
                let facultyRecord = await this.client.query.faculty.findFirst({
                    where: (0, drizzle_orm_1.eq)(schema.faculty.name, facultyName),
                });
                if (!facultyRecord) {
                    [facultyRecord] = await tx
                        .insert(schema.faculty)
                        .values({ name: facultyName })
                        .onConflictDoNothing()
                        .returning();
                }
                await tx
                    .insert(schema.department)
                    .values(departments.map((deptName) => ({
                    name: deptName,
                    facultyId: facultyRecord.id,
                })))
                    .onConflictDoNothing();
            }
        });
        console.log('Database seed complete');
    }
};
exports.DatabaseService = DatabaseService;
exports.DatabaseService = DatabaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [email_queue_service_1.EmailQueueService,
        jwt_1.JwtService])
], DatabaseService);
//# sourceMappingURL=database.service.js.map