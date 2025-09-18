import { json, pgEnum, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enum
export const staffCategory = pgEnum('staff_category', [
  'academic',
  'non_academic',
]);

// Tables
export const faculty = pgTable('faculty', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
});

export const department = pgTable('department', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),

  facultyId: uuid('faculty_id')
    .references(() => faculty.id)
    .notNull(),
});

export const staff = pgTable('staff', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  otherName: varchar('other_name', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  category: staffCategory('category').notNull(),

  departmentId: uuid('department_id')
    .references(() => department.id)
    .notNull(),
});

export const student = pgTable('student', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).unique(),
  matricNumber: varchar('matric_number', { length: 100 }).unique(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  otherName: varchar('other_name', { length: 255 }),

  departmentId: uuid('department_id')
    .references(() => department.id)
    .notNull(),
});

export const course = pgTable('course', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: varchar('code').notNull().unique(),
  title: varchar('title').notNull().unique(),

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
export const staffRelations = relations(staff, ({ one }) => ({
  department: one(department, {
    fields: [staff.departmentId],
    references: [department.id],
  }),
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
  staff: many(staff),
  students: many(student),
  courses: many(course),
}));

export const facultyRelations = relations(faculty, ({ many }) => ({
  departments: many(department),
}));

export const courseRelations = relations(course, ({ one, many }) => ({
  department: one(department, {
    fields: [course.offeredByDeptId],
    references: [department.id],
  }),
  enrollments: many(enrollment),
}));

export const enrollmentRelations = relations(enrollment, ({ one }) => ({
  course: one(course, {
    fields: [enrollment.courseId],
    references: [course.id],
  }),
  student: one(student, {
    fields: [enrollment.studentId],
    references: [student.id],
  }),
}));
