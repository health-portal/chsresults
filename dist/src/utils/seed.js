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
Object.defineProperty(exports, "__esModule", { value: true });
const node_postgres_1 = require("drizzle-orm/node-postgres");
const pg_1 = require("pg");
const environment_1 = require("../environment");
const schema = __importStar(require("../../drizzle/schema"));
const uuid_1 = require("uuid");
const drizzle_orm_1 = require("drizzle-orm");
const pool = new pg_1.Pool({ connectionString: environment_1.env.DATABASE_URL });
const db = (0, node_postgres_1.drizzle)(pool, { schema });
async function seed() {
    console.log('Starting database seed...');
    const defaultAdmins = environment_1.env.DEFAULT_ADMINS;
    console.log(`Seeding ${defaultAdmins.length} admin(s)...`);
    await db
        .insert(schema.admin)
        .values(defaultAdmins.map((admin) => ({
        id: (0, uuid_1.v4)(),
        role: 'admin',
        ...admin,
    })))
        .onConflictDoNothing({ target: schema.admin.email });
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
    await db.transaction(async (tx) => {
        for (const [facultyName, departments] of Object.entries(collegeOfHealthSciences)) {
            console.log(`Faculty: ${facultyName}`);
            let facultyRecord = await db.query.faculty.findFirst({
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
seed()
    .then(async () => {
    console.log('Seeding finished successfully');
    await pool.end();
})
    .catch(async (err) => {
    console.error('Seeding failed:', err);
    await pool.end();
    process.exitCode = 1;
});
//# sourceMappingURL=seed.js.map