import { relations } from "drizzle-orm";
import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { factions } from "./factions";
import { notesOnCharacters, notes } from "./notes";
import { charactersInSessions } from "./sessions";
import { plotsOnCharacters } from "./plots";
import { users } from "./users";

export const characters = sqliteTable("characters", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	raceId: text("race_id").notNull(),
	level: integer("level"),
	class: text("class"), // can be its own table eventually
	bio: text("bio"),
	isPlayer: integer("is_player", { mode: "boolean" }).default(false),
	image: text("image"),
	userId: text("user_id").notNull(),
});

export const charactersRelations = relations(characters, ({ one, many }) => ({
	user: one(users, {
		fields: [characters.userId],
		references: [users.id],
	}),
	notes: many(notesOnCharacters),
	factions: many(charactersInFactions),
	allies: many(allies, { relationName: "character" }),
	allyOf: many(allies, { relationName: "ally" }),
	enemies: many(enemies, { relationName: "character" }),
	enemiesOf: many(enemies, { relationName: "enemy" }),
	race: one(races, {
		fields: [characters.raceId],
		references: [races.id],
	}),
	sessions: many(charactersInSessions),
	plots: many(plotsOnCharacters),
}));

export const races = sqliteTable("races", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	description: text("description"),
});

export const racesRelations = relations(races, ({ many }) => ({
	characters: many(characters),
}));

export const allies = sqliteTable(
	"allies",
	{
		allyId: text("ally_id").notNull(),
		characterId: text("character_id").notNull(),
		noteId: text("note_id"),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.allyId, t.characterId] }),
	}),
);

export const alliesRelations = relations(allies, ({ one }) => ({
	character: one(characters, {
		fields: [allies.characterId],
		references: [characters.id],
		relationName: "character",
	}),
	ally: one(characters, {
		fields: [allies.allyId],
		references: [characters.id],
		relationName: "ally",
	}),
	note: one(notes, {
		fields: [allies.noteId],
		references: [notes.id],
	}),
}));
export const enemies = sqliteTable(
	"enemies",
	{
		enemyId: text("enemy_id").notNull(),
		characterId: text("character_id").notNull(),
		noteId: text("note_id"),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.enemyId, t.characterId] }),
	}),
);

export const enemiesRelations = relations(enemies, ({ one }) => ({
	character: one(characters, {
		fields: [enemies.characterId],
		references: [characters.id],
		relationName: "character",
	}),
	enemy: one(characters, {
		fields: [enemies.enemyId],
		references: [characters.id],
		relationName: "enemy",
	}),
	note: one(notes, {
		fields: [enemies.noteId],
		references: [notes.id],
	}),
}));

export const charactersInFactions = sqliteTable(
	"characters_in_factions",
	{
		characterId: text("character_id").notNull(),
		factionId: text("faction_id").notNull(),
		role: text("role"),
		description: text("description"),
		noteId: text("note_id"),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.characterId, t.factionId] }),
	}),
);

export const charactersInFactionsRelations = relations(
	charactersInFactions,
	({ one }) => ({
		character: one(characters, {
			fields: [charactersInFactions.characterId],
			references: [characters.id],
		}),
		faction: one(factions, {
			fields: [charactersInFactions.factionId],
			references: [factions.id],
		}),
		note: one(notes, {
			fields: [charactersInFactions.noteId],
			references: [notes.id],
		}),
	}),
);
