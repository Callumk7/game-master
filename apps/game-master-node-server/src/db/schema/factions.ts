import { pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { games } from "./games";
import { users } from "./users";
import { characters, charactersInFactions } from "./characters";
import { relations } from "drizzle-orm";
import { notes } from "./notes";

export const factions = pgTable("factions", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	content: text("content"),
	htmlContent: text("html_content"),
	coverImageUrl: text("cover_image_url"),
	gameId: text("game_id")
		.references(() => games.id)
		.notNull(),
	ownerId: text("owner_id")
		.references(() => users.id)
		.notNull(),
	leaderId: text("leader_id").references(() => characters.id),
});

export const factionRelations = relations(factions, ({ one, many }) => ({
	notes: many(notesOnFactions),
	game: one(games, {
		fields: [factions.gameId],
		references: [games.id],
	}),
	owner: one(users, {
		fields: [factions.ownerId],
		references: [users.id],
	}),
	members: many(charactersInFactions)
}));

export const notesOnFactions = pgTable(
	"notes_on_factions",
	{
		noteId: text("note_id")
			.references(() => notes.id)
			.notNull(),
		factionsId: text("faction_id")
			.references(() => factions.id)
			.notNull(),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.noteId, t.factionsId] }),
	}),
);
