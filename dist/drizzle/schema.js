"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.facultyRelations = exports.enrollmentRelations = exports.courseRelations = exports.departmentRelations = exports.studentRelations = exports.lecturerRelations = exports.enrollment = exports.course = exports.department = exports.faculty = exports.token = exports.student = exports.lecturer = exports.admin = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_2 = require("drizzle-orm/pg-core");
exports.admin = (0, pg_core_1.pgTable)('admin', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    email: (0, pg_core_1.text)('email').notNull().unique(),
    phone: (0, pg_core_1.text)('phone'),
    password: (0, pg_core_1.text)('password'),
    name: (0, pg_core_1.text)('name').notNull(),
});
exports.lecturer = (0, pg_core_1.pgTable)('lecturer', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    email: (0, pg_core_1.text)('email').notNull().unique(),
    password: (0, pg_core_1.text)('password'),
    firstName: (0, pg_core_1.text)('first_name').notNull(),
    lastName: (0, pg_core_1.text)('last_name').notNull(),
    otherName: (0, pg_core_1.text)('other_name'),
    phone: (0, pg_core_1.text)('phone'),
    title: (0, pg_core_1.text)('title').notNull(),
    departmentId: (0, pg_core_1.uuid)('department_id')
        .references(() => exports.department.id)
        .notNull(),
});
exports.student = (0, pg_core_1.pgTable)('student', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    email: (0, pg_core_1.text)('email').notNull().unique(),
    matricNumber: (0, pg_core_1.text)('matric_number').notNull().unique(),
    password: (0, pg_core_1.text)('password'),
    firstName: (0, pg_core_1.text)('first_name').notNull(),
    lastName: (0, pg_core_1.text)('last_name').notNull(),
    otherName: (0, pg_core_1.text)('other_name'),
    level: (0, pg_core_2.integer)('level').notNull(),
    gender: (0, pg_core_1.text)('gender').notNull(),
    degree: (0, pg_core_1.text)('degree').notNull(),
    departmentId: (0, pg_core_1.uuid)('department_id')
        .references(() => exports.department.id)
        .notNull(),
});
exports.token = (0, pg_core_1.pgTable)('token', {
    userId: (0, pg_core_1.text)('user_id').notNull(),
    userRole: (0, pg_core_1.text)('user_role').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    tokenString: (0, pg_core_1.text)('token_string').notNull(),
    tokenType: (0, pg_core_1.text)('token_type').notNull(),
}, (table) => ({
    userIdAndRole: (0, pg_core_1.primaryKey)({ columns: [table.userId, table.userRole] }),
}));
exports.faculty = (0, pg_core_1.pgTable)('faculty', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    name: (0, pg_core_1.text)('name').notNull().unique(),
});
exports.department = (0, pg_core_1.pgTable)('department', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    name: (0, pg_core_1.text)('name').notNull().unique(),
    facultyId: (0, pg_core_1.uuid)('faculty_id')
        .references(() => exports.faculty.id)
        .notNull(),
});
exports.course = (0, pg_core_1.pgTable)('course', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    code: (0, pg_core_1.text)('code').notNull().unique(),
    title: (0, pg_core_1.text)('title').notNull().unique(),
    description: (0, pg_core_1.text)('description'),
    units: (0, pg_core_2.integer)('units').notNull(),
    semester: (0, pg_core_2.integer)('semester').notNull(),
    lecturerId: (0, pg_core_1.uuid)('lecturer_id')
        .references(() => exports.lecturer.id)
        .notNull(),
});
exports.enrollment = (0, pg_core_1.pgTable)('enrollment', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    session: (0, pg_core_1.text)('session').notNull(),
    scores: (0, pg_core_1.json)('scores'),
    courseId: (0, pg_core_1.uuid)('course_id')
        .references(() => exports.course.id)
        .notNull(),
    studentId: (0, pg_core_1.uuid)('student_id')
        .references(() => exports.student.id)
        .notNull(),
});
exports.lecturerRelations = (0, drizzle_orm_1.relations)(exports.lecturer, ({ one, many }) => ({
    department: one(exports.department, {
        fields: [exports.lecturer.departmentId],
        references: [exports.department.id],
    }),
    courses: many(exports.course),
}));
exports.studentRelations = (0, drizzle_orm_1.relations)(exports.student, ({ one, many }) => ({
    department: one(exports.department, {
        fields: [exports.student.departmentId],
        references: [exports.department.id],
    }),
    enrollments: many(exports.enrollment),
}));
exports.departmentRelations = (0, drizzle_orm_1.relations)(exports.department, ({ one, many }) => ({
    faculty: one(exports.faculty, {
        fields: [exports.department.facultyId],
        references: [exports.faculty.id],
    }),
    lecturers: many(exports.lecturer),
    students: many(exports.student),
}));
exports.courseRelations = (0, drizzle_orm_1.relations)(exports.course, ({ one, many }) => ({
    lecturer: one(exports.lecturer, {
        fields: [exports.course.lecturerId],
        references: [exports.lecturer.id],
    }),
    enrollments: many(exports.enrollment),
}));
exports.enrollmentRelations = (0, drizzle_orm_1.relations)(exports.enrollment, ({ one }) => ({
    student: one(exports.student, {
        fields: [exports.enrollment.studentId],
        references: [exports.student.id],
    }),
    course: one(exports.course, {
        fields: [exports.enrollment.courseId],
        references: [exports.course.id],
    }),
}));
exports.facultyRelations = (0, drizzle_orm_1.relations)(exports.faculty, ({ many }) => ({
    departments: many(exports.department),
}));
//# sourceMappingURL=schema.js.map