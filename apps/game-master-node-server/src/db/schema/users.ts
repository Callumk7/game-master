import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
	id: text("id").primaryKey().notNull(),
	firstName: text("first_name"),
	lastName: text("last_name"),
	email: text("email").unique().notNull(),
	passwordHash: text("password_hash").notNull()
})

const databaseSelectUserSchema = createSelectSchema(users);
export type DatabaseUser = z.infer<typeof databaseSelectUserSchema>;

export const sessions = pgTable("sessions", {
	id: text("id").primaryKey().notNull(),
	userId: text("user_id").notNull().references(() => users.id),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
})

const databaseSelectSessionSchema = createSelectSchema(sessions);
export type DatabaseSession = z.infer<typeof databaseSelectSessionSchema>;

