import { relations, sql } from "drizzle-orm";
import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { characters } from "./characters";
import { factions } from "./factions";
import { plots } from "./plots";
import { sessions } from "./sessions";
import { users } from "./users";
import { locations } from "./locations";

export const notes = sqliteTable("notes", {
	id: text("id").primaryKey().notNull(),
	name: text("title").notNull(),
	content: text("content"),
	htmlContent: text("html_content").notNull(),
	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: integer("updated_at", { mode: "timestamp_ms" })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	folderId: text("folder_id").notNull().default("NONE"),
	userId: text("user_id").notNull(),
	isLinkNote: integer("is_link_note", { mode: "boolean" }).notNull().default(false),
});

export const notesRelations = relations(notes, ({ one, many }) => ({
	folder: one(folders, {
		fields: [notes.folderId],
		references: [folders.id],
	}),
	tags: many(tagsOnNotes),
	characters: many(notesOnCharacters),
	plots: many(notesOnPlots),
	factions: many(notesOnFactions),
	user: one(users, {
		fields: [notes.userId],
		references: [users.id],
	}),
	// logs: many(notesOnLogs),
	sessions: many(notesOnSessions),
	linkedFrom: many(linkedNotes, { relationName: "from" }),
	linkedTo: many(linkedNotes, { relationName: "to" }),
}));

export const linkedNotes = sqliteTable(
	"linked_notes",
	{
		from: text("from").notNull(),
		to: text("to").notNull(),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.from, t.to] }),
	}),
);

export const linkedNotesRelations = relations(linkedNotes, ({ one }) => ({
	from: one(notes, {
		fields: [linkedNotes.from],
		references: [notes.id],
		relationName: "from",
	}),
	to: one(notes, {
		fields: [linkedNotes.to],
		references: [notes.id],
		relationName: "to",
	}),
}));

export const tags = sqliteTable("tags", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	colour: text("colour").notNull().default("grey"),
	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: integer("updated_at", { mode: "timestamp_ms" })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export const tagsRelations = relations(tags, ({ many }) => ({
	notes: many(tagsOnNotes),
}));

export const tagsOnNotes = sqliteTable(
	"tags_on_notes",
	{
		tagId: text("tag_id").notNull(),
		noteId: text("note_id").notNull(),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.tagId, t.noteId] }),
	}),
);

export const tagsOnNotesRelations = relations(tagsOnNotes, ({ one }) => ({
	tag: one(tags, {
		fields: [tagsOnNotes.tagId],
		references: [tags.id],
	}),
	note: one(notes, {
		fields: [tagsOnNotes.noteId],
		references: [notes.id],
	}),
}));

export const folders = sqliteTable("folders", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: integer("updated_at", { mode: "timestamp_ms" })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	userId: text("user_id").notNull(),
});

export const foldersRelations = relations(folders, ({ one, many }) => ({
	notes: many(notes),
	user: one(users, {
		fields: [folders.userId],
		references: [users.id],
	}),
}));

export const notesOnCharacters = sqliteTable(
	"notes_on_characters",
	{
		noteId: text("note_id").notNull(),
		characterId: text("character_id").notNull(),
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

export const notesOnFactions = sqliteTable(
	"notes_on_factions",
	{
		noteId: text("note_id").notNull(),
		factionId: text("faction_id").notNull(),
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

export const notesOnPlots = sqliteTable(
	"notes_on_plots",
	{
		plotId: text("plot_id").notNull(),
		noteId: text("note_id").notNull(),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.plotId, t.noteId] }),
	}),
);

export const notesOnPlotsRelations = relations(notesOnPlots, ({ one }) => ({
	plot: one(plots, {
		fields: [notesOnPlots.plotId],
		references: [plots.id],
	}),
	note: one(notes, {
		fields: [notesOnPlots.noteId],
		references: [notes.id],
	}),
}));

export const notesOnSessions = sqliteTable(
	"notes_on_sessions",
	{
		noteId: text("note_id").notNull(),
		sessionId: text("session_id").notNull(),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.sessionId, t.noteId] }),
	}),
);

export const notesOnSessionsRelations = relations(notesOnSessions, ({ one }) => ({
	note: one(notes, {
		fields: [notesOnSessions.noteId],
		references: [notes.id],
	}),
	session: one(sessions, {
		fields: [notesOnSessions.sessionId],
		references: [sessions.id],
	}),
}));

export const notesOnLocations = sqliteTable(
	"notes_on_locations",
	{
		noteId: text("note_id").notNull(),
		locationId: text("location_id").notNull(),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.locationId, t.noteId] }),
	}),
);

export const notesOnLocationsRelations = relations(notesOnLocations, ({ one }) => ({
	note: one(notes, {
		fields: [notesOnLocations.noteId],
		references: [notes.id],
	}),
	location: one(locations, {
		fields: [notesOnLocations.locationId],
		references: [locations.id],
	}),
}));
