import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { charactersInFactions, characters } from "./characters";
import { notesOnFactions } from "./notes";
import { plotsOnFactions } from "./plots";
import { factionsInSessions } from "./sessions";
import { users } from "./users";

export const factions = sqliteTable("factions", {
	id: text("id").primaryKey().notNull(),
	userId: text("user_id").notNull(),
	name: text("name").notNull(),
	description: text("description"),
	leaderId: text("leader_id"),
});

export const factionsRelations = relations(factions, ({ one, many }) => ({
	user: one(users, {
		fields: [factions.userId],
		references: [users.id],
	}),
	members: many(charactersInFactions),
	plots: many(plotsOnFactions),
	notes: many(notesOnFactions),
	leader: one(characters, {
		fields: [factions.leaderId],
		references: [characters.id],
	}),
	sessions: many(factionsInSessions),
}));
