import {
  json,
  pgTable,
  timestamp,
  uuid,
  text,
  bigserial,
  inet,
  boolean,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Tables
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  matricNumber: text('matric_number').unique(),
  role: text('role').notNull(),
  hasSetPassword: boolean('has_set_password').default(false).notNull(),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const lecturer = pgTable('lecturer', {
  id: uuid('id').defaultRandom().primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  otherName: text('other_name'),
  phone: text('phone'),

  userId: text('user_id').references(() => user.id),
  departmentId: uuid('department_id')
    .references(() => department.id)
    .notNull(),
});

export const student = pgTable('student', {
  id: uuid('id').defaultRandom().primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  otherName: text('other_name'),

  userId: text('user_id').references(() => user.id),
  departmentId: uuid('department_id')
    .references(() => department.id)
    .notNull(),
});

export const log = pgTable('log', {
  id: bigserial('id', { mode: 'bigint' }).primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  action: text('action').notNull(),
  description: text(),
  metadata: json(),
  ipAddress: inet('ip_address'),
  userAgent: text(),

  userId: text('user_id').references(() => user.id),
});

export const faculty = pgTable('faculty', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
});

export const department = pgTable('department', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),

  facultyId: uuid('faculty_id')
    .references(() => faculty.id)
    .notNull(),
});

export const course = pgTable('course', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: text('code').notNull().unique(),
  title: text('title').notNull().unique(),

  offeredByDeptId: uuid('offered_by_dept_id')
    .references(() => department.id)
    .notNull(),
});

export const enrollment = pgTable('enrollment', {
  id: uuid('id').defaultRandom().primaryKey(),
  result: json('result'),

  courseId: uuid('course_id')
    .references(() => course.id)
    .notNull(),
  studentId: uuid('student_id')
    .references(() => student.id)
    .notNull(),
});

// Relations
export const userRelations = relations(user, ({ one, many }) => ({
  student: one(student, { fields: [user.id], references: [student.userId] }),
  lecturer: one(lecturer, { fields: [user.id], references: [lecturer.userId] }),
  logs: many(log),
}));

export const lecturerRelations = relations(lecturer, ({ one }) => ({
  user: one(user, { fields: [lecturer.userId], references: [user.id] }),
  department: one(department, {
    fields: [lecturer.departmentId],
    references: [department.id],
  }),
}));

export const studentRelations = relations(student, ({ one, many }) => ({
  user: one(user, { fields: [student.userId], references: [user.id] }),
  department: one(department, {
    fields: [student.departmentId],
    references: [department.id],
  }),
  enrollments: many(enrollment),
}));

export const logRelations = relations(log, ({ one }) => ({
  user: one(user, { fields: [log.userId], references: [user.id] }),
}));

export const departmentRelations = relations(department, ({ one, many }) => ({
  faculty: one(faculty, {
    fields: [department.facultyId],
    references: [faculty.id],
  }),
  lecturers: many(lecturer),
  students: many(student),
  courses: many(course),
}));

export const courseRelations = relations(course, ({ one, many }) => ({
  department: one(department, {
    fields: [course.offeredByDeptId],
    references: [department.id],
  }),
  enrollments: many(enrollment),
}));

export const enrollmentRelations = relations(enrollment, ({ one }) => ({
  student: one(student, {
    fields: [enrollment.studentId],
    references: [student.id],
  }),
  course: one(course, {
    fields: [enrollment.courseId],
    references: [course.id],
  }),
}));

export const facultyRelations = relations(faculty, ({ many }) => ({
  departments: many(department),
}));
