import { relations } from "drizzle-orm";
import {
	boolean,
	integer,
	pgEnum,
	pgTable,
	primaryKey,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { user } from "./auth";
import { factions } from "./factions";
import { games } from "./games";
import { images } from "./images";
import { folders, notes } from "./notes";

export const visibilityEnum = pgEnum("visibility", ["public", "private", "viewable"]);

export const characters = pgTable("characters", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	level: integer("level").notNull().default(1),
	characterClass: text("class"),
	race: text("race"),
	strength: integer("strength"),
	dexterity: integer("dexterity"),
	constitution: integer("constitution"),
	intelligence: integer("intelligence"),
	wisdom: integer("wisdom"),
	charisma: integer("charisma"),
	personality: text("personality"),
	goal: text("goal"),
	flaw: text("flaw"),
	content: text("content"),
	htmlContent: text("html_content"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull(),
	coverImageUrl: text("cover_image_url"),
	gameId: text("game_id")
		.references(() => games.id)
		.notNull(),
	ownerId: text("owner_id")
		.references(() => user.id)
		.notNull(),
	folderId: text("folder_id").references(() => folders.id),
	isPlayer: boolean("is_player").notNull().default(false),
	visibility: visibilityEnum("visibility").notNull().default("private"),
	primaryFactionId: text("primary_faction_id").references(() => factions.id),
});

export const databaseSelectCharacterSchema = createSelectSchema(characters);
export type DatabaseCharacter = z.infer<typeof databaseSelectCharacterSchema>;

export const databaseInsertCharacterSchema = createInsertSchema(characters);
export type InsertDatabaseCharacter = z.infer<typeof databaseInsertCharacterSchema>;

export const characterRelations = relations(characters, ({ one, many }) => ({
	notes: many(notesOnCharacters),
	game: one(games, {
		fields: [characters.gameId],
		references: [games.id],
	}),
	owner: one(user, {
		fields: [characters.ownerId],
		references: [user.id],
	}),
	folder: one(folders, {
		fields: [characters.folderId],
		references: [folders.id],
	}),
	factions: many(charactersInFactions),
	primaryFaction: one(factions, {
		fields: [characters.primaryFactionId],
		references: [factions.id],
	}),
	permissions: many(charactersPermissions),
	images: many(images),
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
		label: text("label"),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.noteId, t.characterId] }),
	}),
);

export const notesOnCharactersRelations = relations(notesOnCharacters, ({ one }) => ({
	note: one(notes, {
		fields: [notesOnCharacters.noteId],
		references: [notes.id],
	}),
	character: one(characters, {
		fields: [notesOnCharacters.characterId],
		references: [characters.id],
	}),
}));

export const charactersInFactions = pgTable(
	"characters_in_factions",
	{
		characterId: text("character_id")
			.references(() => characters.id, { onDelete: "cascade" })
			.notNull(),
		factionId: text("faction_id")
			.references(() => factions.id, { onDelete: "cascade" })
			.notNull(),
		role: text("role"),
	},

	(t) => ({
		pk: primaryKey({ columns: [t.factionId, t.characterId] }),
	}),
);

export const databaseSelectCharactersInFactionsSchema =
	createSelectSchema(charactersInFactions);
export type DatabaseCharacterInFaction = z.infer<
	typeof databaseSelectCharactersInFactionsSchema
>;

export const charactersInFactionsRelations = relations(
	charactersInFactions,
	({ one }) => ({
		faction: one(factions, {
			fields: [charactersInFactions.factionId],
			references: [factions.id],
		}),
		character: one(characters, {
			fields: [charactersInFactions.characterId],
			references: [characters.id],
		}),
	}),
);

export const permissionEnum = pgEnum("permission", ["none", "view", "edit"]);

export const charactersPermissions = pgTable(
	"characters_permissions",
	{
		characterId: text("character_id")
			.notNull()
			.references(() => characters.id, { onDelete: "cascade" }),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		permission: permissionEnum("permission").notNull(),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.userId, t.characterId] }),
	}),
);

export const charactersPermissionsRelations = relations(
	charactersPermissions,
	({ one }) => ({
		character: one(characters, {
			fields: [charactersPermissions.characterId],
			references: [characters.id],
		}),
		user: one(user, {
			fields: [charactersPermissions.userId],
			references: [user.id],
		}),
	}),
);
