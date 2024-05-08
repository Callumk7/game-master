import { relations } from "drizzle-orm";
import { primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { characters } from "./characters";
import { factions } from "./factions";
import { notes, notesOnPlots } from "./notes";
import { plotsInSessions } from "./sessions";
import { users } from "./users";

export const plots = sqliteTable("plots", {
	id: text("id").primaryKey().notNull(),
	userId: text("user_id").notNull(),
	name: text("title").notNull(),
	description: text("description"),
	keyCharacterId: text("key_character_id"),
});

export const plotsRelations = relations(plots, ({ one, many }) => ({
	user: one(users, {
		fields: [plots.userId],
		references: [users.id],
	}),
	keyCharacter: one(characters, {
		fields: [plots.keyCharacterId],
		references: [characters.id],
	}),
	characters: many(plotsOnCharacters),
	factions: many(plotsOnFactions),
	notes: many(notesOnPlots),
	sessions: many(plotsInSessions),
}));

export const plotsOnCharacters = sqliteTable(
	"plots_on_characters",
	{
		plotId: text("plot_id").notNull(),
		characterId: text("character_id").notNull(),
		noteId: text("note_id"),
		description: text("description"),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.plotId, t.characterId] }),
	}),
);

export const plotsOnCharactersRelations = relations(plotsOnCharacters, ({ one }) => ({
	plot: one(plots, {
		fields: [plotsOnCharacters.plotId],
		references: [plots.id],
	}),
	character: one(characters, {
		fields: [plotsOnCharacters.characterId],
		references: [characters.id],
	}),
	note: one(notes, {
		fields: [plotsOnCharacters.noteId],
		references: [notes.id],
	}),
}));

export const plotsOnFactions = sqliteTable(
	"plots_on_factions",
	{
		plotId: text("plot_id").notNull(),
		factionId: text("faction_id").notNull(),
		noteId: text("note_id"),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.plotId, t.factionId] }),
	}),
);

export const plotsOnFactionsRelations = relations(plotsOnFactions, ({ one }) => ({
	plot: one(plots, {
		fields: [plotsOnFactions.plotId],
		references: [plots.id],
	}),
	faction: one(factions, {
		fields: [plotsOnFactions.factionId],
		references: [factions.id],
	}),
	note: one(notes, {
		fields: [plotsOnFactions.noteId],
		references: [notes.id],
	}),
}));
