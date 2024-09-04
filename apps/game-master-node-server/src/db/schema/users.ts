import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

export const users = pgTable("users", {
	id: text("id").primaryKey().notNull(),
	firstName: text("first_name"),
	lastName: text("last_name"),
	username: text("username").notNull(),
	email: text("email").unique().notNull(),
	passwordHash: text("password_hash").notNull()
})

export const databaseSelectUserSchema = createSelectSchema(users);
export type DatabaseUser = z.infer<typeof databaseSelectUserSchema>;

export const databaseInsertUserSchema = createInsertSchema(users);
export type InsertDatabaseUser = z.infer<typeof databaseInsertUserSchema>;

export const sessions = pgTable("sessions", {
	id: text("id").primaryKey().notNull(),
	userId: text("user_id").notNull().references(() => users.id),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
})

const databaseSelectSessionSchema = createSelectSchema(sessions);
export type DatabaseSession = z.infer<typeof databaseSelectSessionSchema>;

