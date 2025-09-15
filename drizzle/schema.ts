import { uuid, pgTable, varchar } from 'drizzle-orm/pg-core';

export const staffTable = pgTable('staff', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),

  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  otherName: varchar('other_name', { length: 255 }),
});

export const studentTable = pgTable('student', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).unique(),
  matricNumber: varchar('matric_number', { length: 100 }).unique(),

  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  otherName: varchar('other_name', { length: 255 }),
});

export const departmentTable = pgTable('department', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
});

export const roleTable = pgTable('role', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
});

export const facultyTable = pgTable('faculty', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
});
