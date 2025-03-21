import { boolean, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

export const users = pgTable("users", {
	id: text("id").primaryKey().notNull(),
	authId: integer("auth_id"),
	firstName: text("first_name"),
	lastName: text("last_name"),
	username: text("username").notNull(),
	email: text("email").unique().notNull(),
	emailVerified: boolean("email_verified"),
	emailVerificationToken: text("email_verification_token"),
	emailVerificationTokenExpiry: timestamp("email_verification_token_expiry", {
		withTimezone: true,
		mode: "date",
	}),
	resetToken: text("reset_token"),
	resetTokenExpiry: timestamp("reset_token_expiry", {
		withTimezone: true,
		mode: "date",
	}),
});

export const databaseSelectUserSchema = createSelectSchema(users);
export type DatabaseUser = z.infer<typeof databaseSelectUserSchema>;

export const databaseInsertUserSchema = createInsertSchema(users);
export type InsertDatabaseUser = z.infer<typeof databaseInsertUserSchema>;
