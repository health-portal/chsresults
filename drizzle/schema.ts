import {
  json,
  pgTable,
  timestamp,
  uuid,
  text,
  bigserial,
  inet,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { integer } from 'drizzle-orm/pg-core';

// Tables
export const admin = pgTable('admin', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),

  email: text('email').notNull().unique(),
  phone: text('phone'),
  password: text('password'),
  name: text('name').notNull(),
});

export const lecturer = pgTable('lecturer', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),

  email: text('email').notNull().unique(),
  password: text('password'),

  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  otherName: text('other_name'),
  phone: text('phone'),
  title: text('title').notNull(),

  departmentId: uuid('department_id')
    .references(() => department.id)
    .notNull(),
});

export const student = pgTable('student', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),

  email: text('email').notNull().unique(),
  matricNumber: text('matric_number').notNull().unique(),
  password: text('password'),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  otherName: text('other_name'),
  level: integer('level').notNull(),
  gender: text('gender').notNull(),
  degree: text('degree').notNull(),

  departmentId: uuid('department_id')
    .references(() => department.id)
    .notNull(),
});

export const log = pgTable('log', {
  id: bigserial('id', { mode: 'bigint' }).primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  userId: text('user_id').notNull(),
  userRole: text('user_role').notNull(),
  action: text('action').notNull(),
  description: text('description'),
  metadata: json('metadata'),
  ipAddress: inet('ip_address'),
  userAgent: text(),
});

export const faculty = pgTable('faculty', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  name: text('name').notNull().unique(),
});

export const department = pgTable('department', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  name: text('name').notNull().unique(),

  facultyId: uuid('faculty_id')
    .references(() => faculty.id)
    .notNull(),
});

export const course = pgTable('course', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),

  code: text('code').notNull().unique(),
  title: text('title').notNull().unique(),
  description: text('description'),
  units: integer('units').notNull(),
  semester: integer('semester').notNull(),

  lecturerId: uuid('lecturer_id')
    .references(() => lecturer.id)
    .notNull(),
});

export const enrollment = pgTable('enrollment', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),

  session: text('session').notNull(),
  scores: json('scores'),

  courseId: uuid('course_id')
    .references(() => course.id)
    .notNull(),
  studentId: uuid('student_id')
    .references(() => student.id)
    .notNull(),
});

// Relations
export const lecturerRelations = relations(lecturer, ({ one, many }) => ({
  department: one(department, {
    fields: [lecturer.departmentId],
    references: [department.id],
  }),
  courses: many(course),
}));

export const studentRelations = relations(student, ({ one, many }) => ({
  department: one(department, {
    fields: [student.departmentId],
    references: [department.id],
  }),
  enrollments: many(enrollment),
}));

export const departmentRelations = relations(department, ({ one, many }) => ({
  faculty: one(faculty, {
    fields: [department.facultyId],
    references: [faculty.id],
  }),
  lecturers: many(lecturer),
  students: many(student),
}));

export const courseRelations = relations(course, ({ one, many }) => ({
  lecturer: one(lecturer, {
    fields: [course.lecturerId],
    references: [lecturer.id],
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
