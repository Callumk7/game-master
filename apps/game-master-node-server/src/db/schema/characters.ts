import { pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { games } from "./games";
import { users } from "./users";
import { notes } from "./notes";
import { relations } from "drizzle-orm";
import { factions } from "./factions";

export const characters = pgTable("characters", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	content: text("content"),
	htmlContent: text("html_content"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull(),
	coverImageUrl: text("cover_image_url"),
	gameId: text("game_id")
		.references(() => games.id)
		.notNull(),
	ownerId: text("owner_id")
		.references(() => users.id)
		.notNull(),
});

export const characterRelations = relations(characters, ({ one, many }) => ({
	notes: many(notesOnCharacters),
	game: one(games, {
		fields: [characters.gameId],
		references: [games.id],
	}),
	owner: one(users, {
		fields: [characters.ownerId],
		references: [users.id],
	}),
	factions: many(charactersInFactions), // ...a member of
}));

export const notesOnCharacters = pgTable(
	"notes_on_characters",
	{
		noteId: text("note_id")
			.references(() => notes.id)
			.notNull(),
		characterId: text("character_id")
			.references(() => characters.id)
			.notNull(),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.noteId, t.characterId] }),
	}),
);

export const charactersInFactions = pgTable(
	"characters_in_factions",
	{
		characterId: text("character_id")
			.references(() => characters.id)
			.notNull(),
		factionId: text("faction_id")
			.references(() => factions.id)
			.notNull(),
		role: text("role")
	},

	(t) => ({
		pk: primaryKey({ columns: [t.factionId, t.characterId] }),
	}),
);
