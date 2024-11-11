import { relations } from "drizzle-orm";
import { pgEnum, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { characters, notesOnCharacters } from "./characters";
import { factions, notesOnFactions } from "./factions";
import { games } from "./games";
import { images } from "./images";
import { users } from "./users";

export const visibilityEnum = pgEnum("visibility", ["public", "private", "viewable"]);

export const noteTypeEnum = pgEnum("note_type", [
	"note",
	"character",
	"faction",
	"location",
	"item",
	"quest",
]);

export const notes = pgTable("notes", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	content: text("content"),
	htmlContent: text("html_content"),
	createdAt: timestamp("created_at", {
		withTimezone: true,
		mode: "date",
	}).notNull(),
	updatedAt: timestamp("updated_at", {
		withTimezone: true,
		mode: "date",
	}).notNull(),
	ownerId: text("owner_id")
		.notNull()
		.references(() => users.id),
	folderId: text("folder_id").references(() => folders.id),
	gameId: text("game_id")
		.references(() => games.id)
		.notNull(),
	type: noteTypeEnum("type").default("note").notNull(),
	visibility: visibilityEnum("visibility").notNull().default("private"),
});

export const notesRelations = relations(notes, ({ one, many }) => ({
	owner: one(users, {
		fields: [notes.ownerId],
		references: [users.id],
	}),
	game: one(games, {
		fields: [notes.gameId],
		references: [games.id],
	}),
	folder: one(folders, {
		fields: [notes.folderId],
		references: [folders.id],
	}),
	characters: many(notesOnCharacters),
	factions: many(notesOnFactions),
	permissions: many(notesPermissions),
	images: many(images),
}));

export const links = pgTable("links", {
	fromId: text("from_id").notNull(),
	toId: text("to_id").notNull(),
	label: text("label"),
});

export const linksRelations = relations(links, ({ one }) => ({
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
	createdAt: timestamp("created_at", {
		withTimezone: true,
		mode: "date",
	}).notNull(),
	updatedAt: timestamp("updated_at", {
		withTimezone: true,
		mode: "date",
	}).notNull(),
	parentFolderId: text("parent_folder_id"),
	gameId: text("game_id")
		.notNull()
		.references(() => games.id),
	ownerId: text("owner_id")
		.notNull()
		.references(() => users.id),
	visibility: visibilityEnum("visibility").notNull().default("private"),
});

export const folderRelations = relations(folders, ({ one, many }) => ({
	game: one(games, {
		fields: [folders.gameId],
		references: [games.id],
	}),
	notes: many(notes),
	characters: many(characters),
	factions: many(factions),
	parent: one(folders, {
		fields: [folders.parentFolderId],
		references: [folders.id],
		relationName: "parent",
	}),
	children: many(folders, { relationName: "parent" }),
}));

export const databaseSelectFolderSchema = createSelectSchema(folders);
export type DatabaseFolder = z.infer<typeof databaseSelectFolderSchema>;

export const databaseInsertFolderSchema = createInsertSchema(folders);
export type InsertDatabaseFolder = z.infer<typeof databaseInsertFolderSchema>;

export const permissionEnum = pgEnum("permission", ["none", "view", "edit"]);

export const notesPermissions = pgTable(
	"notes_permissions",
	{
		noteId: text("note_id")
			.notNull()
			.references(() => notes.id, { onDelete: "cascade" }),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		permission: permissionEnum("permission").notNull(),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.userId, t.noteId] }),
	}),
);

export const notesPermissionsRelations = relations(notesPermissions, ({ one }) => ({
	note: one(notes, {
		fields: [notesPermissions.noteId],
		references: [notes.id],
	}),
	user: one(users, {
		fields: [notesPermissions.userId],
		references: [users.id],
	}),
}));

export const foldersPermissions = pgTable(
	"folders_permissions",
	{
		folderId: text("folder_id")
			.notNull()
			.references(() => folders.id),
		userId: text("user_id")
			.notNull()
			.references(() => users.id),
		permission: permissionEnum("permission").notNull(),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.userId, t.folderId] }),
	}),
);

export const foldersPermissionsRelations = relations(foldersPermissions, ({ one }) => ({
	folder: one(folders, {
		fields: [foldersPermissions.folderId],
		references: [folders.id],
	}),
	user: one(users, {
		fields: [foldersPermissions.userId],
		references: [users.id],
	}),
}));
