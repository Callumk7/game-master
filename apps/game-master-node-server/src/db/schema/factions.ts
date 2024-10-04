import { relations } from "drizzle-orm";
import {
	boolean,
	pgEnum,
	pgTable,
	primaryKey,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { characters, charactersInFactions } from "./characters";
import { games } from "./games";
import { notes } from "./notes";
import { users } from "./users";

export const visibilityEnum = pgEnum("visibility", [
	"public",
	"private",
	"viewable",
	"partial",
]);

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
		.references(() => users.id)
		.notNull(),
	leaderId: text("leader_id").references(() => characters.id),
	visibility: visibilityEnum("visibility").notNull().default("private"),
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
	owner: one(users, {
		fields: [factions.ownerId],
		references: [users.id],
	}),
	members: many(charactersInFactions),
	permissions: many(factionsPermissions),
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

export const factionsPermissions = pgTable(
	"factions_permissions",
	{
		factionId: text("faction_id")
			.notNull()
			.references(() => factions.id),
		userId: text("user_id")
			.notNull()
			.references(() => users.id),
		canView: boolean("can_view").notNull(),
		canEdit: boolean("can_edit").notNull().default(false),
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
	user: one(users, {
		fields: [factionsPermissions.userId],
		references: [users.id],
	}),
}));
