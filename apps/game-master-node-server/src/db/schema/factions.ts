import { relations } from "drizzle-orm";
import {
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
import { characters, charactersInFactions } from "./characters";
import { games } from "./games";
import { images } from "./images";
import { folders, notes } from "./notes";

export const visibilityEnum = pgEnum("visibility", ["public", "private", "viewable"]);

export const factions = pgTable("factions", {
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
		.references(() => user.id)
		.notNull(),
	folderId: text("folder_id").references(() => folders.id),
	visibility: visibilityEnum("visibility").notNull().default("private"),
	// add some nice to have stuff
	location: text("location"), // could be a location note
	alignment: text("alignment"),
	leaderId: text("leader_id"),
	power: integer("power"),
});

export const databaseSelectFactionSchema = createSelectSchema(factions);
export type DatabaseFaction = z.infer<typeof databaseSelectFactionSchema>;

export const databaseInsertFactionSchema = createInsertSchema(factions);
export type InsertDatabaseFaction = z.infer<typeof databaseInsertFactionSchema>;

export const factionRelations = relations(factions, ({ one, many }) => ({
	notes: many(notesOnFactions),
	game: one(games, {
		fields: [factions.gameId],
		references: [games.id],
	}),
	folder: one(folders, {
		fields: [factions.folderId],
		references: [folders.id],
	}),
	owner: one(user, {
		fields: [factions.ownerId],
		references: [user.id],
	}),
	members: many(charactersInFactions),
	permissions: many(factionsPermissions),
	images: many(images),
	leader: one(characters, {
		fields: [factions.leaderId],
		references: [characters.id],
	}),
}));

export const notesOnFactions = pgTable(
	"notes_on_factions",
	{
		noteId: text("note_id")
			.references(() => notes.id)
			.notNull(),
		factionId: text("faction_id")
			.references(() => factions.id)
			.notNull(),
		label: text("label"),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.noteId, t.factionId] }),
	}),
);

export const notesOnFactionsRelations = relations(notesOnFactions, ({ one }) => ({
	note: one(notes, {
		fields: [notesOnFactions.noteId],
		references: [notes.id],
	}),
	faction: one(factions, {
		fields: [notesOnFactions.factionId],
		references: [factions.id],
	}),
}));

export const permissionEnum = pgEnum("permission", ["none", "view", "edit"]);

export const factionsPermissions = pgTable(
	"factions_permissions",
	{
		factionId: text("faction_id")
			.notNull()
			.references(() => factions.id),
		userId: text("user_id")
			.notNull()
			.references(() => user.id),
		permission: permissionEnum("permission").notNull(),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.userId, t.factionId] }),
	}),
);

export const factionsPermissionsRelations = relations(factionsPermissions, ({ one }) => ({
	faction: one(factions, {
		fields: [factionsPermissions.factionId],
		references: [factions.id],
	}),
	user: one(user, {
		fields: [factionsPermissions.userId],
		references: [user.id],
	}),
}));
