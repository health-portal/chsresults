import { relations } from 'drizzle-orm';
import {
  pgTable,
  uuid,
  varchar,
  boolean,
  integer,
  timestamp,
  json,
  primaryKey,
} from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),

  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }),
  fullName: varchar('full_name', { length: 100 }).notNull(),
  role: varchar('role', { length: 50 }).notNull(),
});

export const token = pgTable('token_data', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .references(() => user.id)
    .notNull()
    .unique(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),

  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  tokenString: varchar('token_string', { length: 255 }).notNull(),
});

export const staff = pgTable('staff', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .references(() => user.id)
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),

  phoneNumber: varchar('phone_number', { length: 20 }).unique(),
  title: varchar('title', { length: 20 }).notNull(),
  qualification: varchar('qualification', { length: 40 }).notNull(),

  departmentId: uuid('department_id')
    .references(() => department.id)
    .notNull(),
});

export const staffPosition = pgTable(
  'staff_position',
  {
    staffId: uuid('staff_id')
      .references(() => staff.id)
      .notNull(),

    designation: varchar('designation', { length: 50 }).notNull(),
    name: varchar('unit_name', { length: 50 }).notNull(),
  },
  (table) => ({
    description: primaryKey({
      name: 'description',
      columns: [table.designation, table.name],
    }),
  }),
);

export const student = pgTable('student', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .references(() => user.id)
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),

  matricNumber: varchar('matric_number', { length: 50 }).unique().notNull(),
  level: integer('level').notNull(),
  gender: varchar('gender', { length: 10 }).notNull(),
  degree: varchar('degree', { length: 50 }).notNull(),

  departmentId: uuid('department_id')
    .references(() => department.id)
    .notNull(),
});

export const faculty = pgTable('faculty', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),

  name: varchar('name', { length: 100 }).notNull().unique(),
});

export const department = pgTable('department', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),

  name: varchar('name', { length: 100 }).notNull().unique(),

  facultyId: uuid('faculty_id')
    .references(() => faculty.id)
    .notNull(),
});

export const session = pgTable('session', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),

  name: varchar('name', { length: 20 }).notNull().unique(),
  startDate: timestamp('start_date', { withTimezone: true }).notNull(),
  endDate: timestamp('end_date', { withTimezone: true }).notNull(),
  isActive: boolean('is_active').default(false),
});

export const course = pgTable('course', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),

  code: varchar('code', { length: 20 }).notNull().unique(),
  title: varchar('title', { length: 100 }).notNull(),
  description: varchar('description', { length: 255 }),
  units: integer('units').notNull(),
  semester: varchar('semester', { length: 30 }).notNull(),
});

export const courseLecturer = pgTable('course_lecturer', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),

  isCoordinator: boolean('is_coordinator').default(false),

  courseId: uuid('course_id')
    .references(() => course.id)
    .notNull(),
  lecturerId: uuid('lecturer_id')
    .references(() => staff.id)
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

  scores: json('scores'),

  sessionId: uuid('session_id')
    .references(() => session.id)
    .notNull(),
  courseId: uuid('course_id')
    .references(() => course.id)
    .notNull(),
  studentId: uuid('student_id')
    .references(() => student.id)
    .notNull(),
});

// Relations
export const userRelations = relations(user, ({ one, many }) => ({
  tokens: many(token),
  staff: one(staff, { fields: [user.id], references: [staff.userId] }),
  student: one(student, { fields: [user.id], references: [student.userId] }),
}));

export const tokenRelations = relations(token, ({ one }) => ({
  user: one(user, { fields: [token.userId], references: [user.id] }),
}));

export const staffRelations = relations(staff, ({ one, many }) => ({
  user: one(user, { fields: [staff.userId], references: [user.id] }),
  department: one(department, {
    fields: [staff.departmentId],
    references: [department.id],
  }),
  courses: many(course),
  position: one(staffPosition, {
    fields: [staff.id],
    references: [staffPosition.staffId],
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

export const facultyRelations = relations(faculty, ({ many }) => ({
  departments: many(department),
}));

export const departmentRelations = relations(department, ({ one, many }) => ({
  faculty: one(faculty, {
    fields: [department.facultyId],
    references: [faculty.id],
  }),
  staff: many(staff),
  students: many(student),
}));

export const courseRelations = relations(course, ({ many }) => ({
  lecturers: many(staff),
  enrollments: many(enrollment),
}));

export const courseLecturerRelations = relations(courseLecturer, ({ one }) => ({
  course: one(course, {
    fields: [courseLecturer.courseId],
    references: [course.id],
  }),
  lecturer: one(staff, {
    fields: [courseLecturer.lecturerId],
    references: [staff.id],
  }),
}));

export const sessionRelations = relations(session, ({ many }) => ({
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
  session: one(session, {
    fields: [enrollment.sessionId],
    references: [session.id],
  }),
}));
