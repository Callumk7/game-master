import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { relations } from "drizzle-orm";
import { games } from "./games";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

export const noteTypeEnum = pgEnum("type", [
	"note",
	"location",
	"character",
	"faction",
	"item",
	"quest",
]);

export const notes = pgTable("notes", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	content: text("content"),
	htmlContent: text("html_content"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull(),
	ownerId: text("owner_id")
		.notNull()
		.references(() => users.id),
	folderId: text("folder_id").references(() => folders.id),
	gameId: text("game_id").references(() => games.id),
	type: noteTypeEnum("type"),
});

export const notesRelations = relations(notes, ({ one, many }) => ({
	game: one(games, {
		fields: [notes.gameId],
		references: [games.id],
	}),
	folder: one(folders, {
		fields: [notes.folderId],
		references: [folders.id],
	}),
}));

export const links = pgTable("links", {
	fromId: text("from_id").notNull(),
	toId: text("to_id").notNull(),
	description: text("description"),
});

export const linksRelations = relations(links, ({ one, many }) => ({
	from: one(notes, {
		fields: [links.fromId],
		references: [notes.id],
		relationName: "from",
	}),
	to: one(notes, {
		fields: [links.toId],
		references: [notes.id],
		relationName: "to",
	}),
}));

export const databaseSelectNoteSchema = createSelectSchema(notes);
export type DatabaseNote = z.infer<typeof databaseSelectNoteSchema>;

export const databaseInsertNoteSchema = createInsertSchema(notes);
export type InsertDatabaseNote = z.infer<typeof databaseInsertNoteSchema>;

export const folders = pgTable("folders", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	parentFolderId: text("parent_folder_id"),
	ownerId: text("owner_id")
		.notNull()
		.references(() => users.id),
});

export const folderRelations = relations(folders, ({ one, many }) => ({
	notes: many(notes),
}));
