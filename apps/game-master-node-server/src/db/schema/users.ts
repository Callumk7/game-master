import { relations } from "drizzle-orm";
import { boolean, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { charactersPermissions } from "./characters";
import { factionsPermissions } from "./factions";
import { usersToGames } from "./games";
import { notesPermissions } from "./notes";

export const users = pgTable("users", {
	id: text("id").primaryKey().notNull(),
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
	passwordHash: text("password_hash").notNull(),
	resetToken: text("reset_token"),
	resetTokenExpiry: timestamp("reset_token_expiry", {
		withTimezone: true,
		mode: "date",
	}),
	authId: integer("auth_id").notNull().unique()
});

export const usersRelations = relations(users, ({ many }) => ({
	games: many(usersToGames),
	characterPermissions: many(charactersPermissions),
	factionPermissions: many(factionsPermissions),
	notePermissions: many(notesPermissions),
}));

export const databaseSelectUserSchema = createSelectSchema(users);
export type DatabaseUser = z.infer<typeof databaseSelectUserSchema>;

export const databaseInsertUserSchema = createInsertSchema(users);
export type InsertDatabaseUser = z.infer<typeof databaseInsertUserSchema>;

export const sessions = pgTable("sessions", {
	id: text("id").primaryKey().notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
});

const databaseSelectSessionSchema = createSelectSchema(sessions);
export type DatabaseSession = z.infer<typeof databaseSelectSessionSchema>;
