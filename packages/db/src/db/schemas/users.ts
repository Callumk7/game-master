import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { folders, notes } from "./notes";
import { characters } from "./characters";
import { factions } from "./factions";
import { plots } from "./plots";
import { sessions } from "./sessions";

export const users = sqliteTable("users", {
	id: text("id").primaryKey().notNull(),
	fullName: text("full_name"),
	username: text("username").notNull(),
	email: text("email").notNull().unique(),
	password: text("password").notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
	folders: many(folders),
	notes: many(notes),
	characters: many(characters),
	factions: many(factions),
	plots: many(plots),
	sessions: many(sessions),
}));
