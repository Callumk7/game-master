import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: text("id").primaryKey().notNull(),
	firstName: text("first_name"),
	lastName: text("last_name"),
	email: text("email").unique()
})

export const sessions = pgTable("sessions", {
	id: text("id").primaryKey().notNull(),
	userId: text("user_id").notNull().references(() => users.id),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
})
