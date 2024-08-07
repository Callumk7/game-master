import { relations } from "drizzle-orm";
import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { characters } from "./characters";
import { factions } from "./factions";
import { notes, notesOnSessions } from "./notes";
import { plots } from "./plots";
import { users } from "./users";
import { locations } from "./locations";

export const sessions = sqliteTable("sessions", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	userId: text("user_id").notNull(),
	description: text("description"),
	sessionNumber: integer("session_number"),
	sessionDate: integer("session_date", { mode: "timestamp" }),
	pinnedNoteId: text("pinned_note_id"),
});

export const sessionsRelations = relations(sessions, ({ one, many }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id],
	}),
	characters: many(charactersInSessions),
	factions: many(factionsInSessions),
	plots: many(plotsInSessions),
	notes: many(notesOnSessions),
	pinnedNote: one(notes, {
		fields: [sessions.pinnedNoteId],
		references: [notes.id],
	}),
	images: many(images),
}));

export const charactersInSessions = sqliteTable(
	"characters_in_sessions",
	{
		characterId: text("character_id").notNull(),
		sessionId: text("session_id").notNull(),
		noteId: text("note_id"),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.sessionId, t.characterId] }),
	}),
);

export const charactersInSessionsRelations = relations(
	charactersInSessions,
	({ one }) => ({
		character: one(characters, {
			fields: [charactersInSessions.characterId],
			references: [characters.id],
		}),
		session: one(sessions, {
			fields: [charactersInSessions.sessionId],
			references: [sessions.id],
		}),
		note: one(notes, {
			fields: [charactersInSessions.noteId],
			references: [notes.id],
		}),
	}),
);

export const factionsInSessions = sqliteTable(
	"factions_in_sessions",
	{
		factionId: text("faction_id").notNull(),
		sessionId: text("session_id").notNull(),
		noteId: text("note_id"),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.sessionId, t.factionId] }),
	}),
);

export const factionsInSessionsRelations = relations(factionsInSessions, ({ one }) => ({
	faction: one(factions, {
		fields: [factionsInSessions.factionId],
		references: [factions.id],
	}),
	session: one(sessions, {
		fields: [factionsInSessions.sessionId],
		references: [sessions.id],
	}),
	note: one(notes, {
		fields: [factionsInSessions.noteId],
		references: [notes.id],
	}),
}));

export const plotsInSessions = sqliteTable(
	"plots_in_sessions",
	{
		plotId: text("plot_id").notNull(),
		sessionId: text("session_id").notNull(),
		noteId: text("note_id"),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.sessionId, t.plotId] }),
	}),
);

export const plotsInSessionsRelations = relations(plotsInSessions, ({ one }) => ({
	plot: one(plots, {
		fields: [plotsInSessions.plotId],
		references: [plots.id],
	}),
	session: one(sessions, {
		fields: [plotsInSessions.sessionId],
		references: [sessions.id],
	}),
	note: one(notes, {
		fields: [plotsInSessions.noteId],
		references: [notes.id],
	}),
}));

export const locationsInSessions = sqliteTable(
	"locations_in_sessions",
	{
		locationId: text("note_id").notNull(),
		sessionId: text("session_id").notNull(),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.locationId, t.sessionId] }),
	}),
);

export const locationsInSessionsRelations = relations(locationsInSessions, ({ one }) => ({
	session: one(sessions, {
		fields: [locationsInSessions.sessionId],
		references: [sessions.id],
	}),
	location: one(locations, {
		fields: [locationsInSessions.locationId],
		references: [locations.id],
	}),
}));

export const images = sqliteTable("images", {
	id: text("id").primaryKey().notNull(),
	key: text("key").notNull(),
	imageUrl: text("image_url").notNull(),
	sessionId: text("session_id").notNull(),
});

export const imagesRelations = relations(images, ({ one }) => ({
	session: one(sessions, {
		fields: [images.sessionId],
		references: [sessions.id],
	}),
}));

// export const imagesInSessions = sqliteTable(
// 	"images_in_sessions",
// 	{
// 		imageId: text("image_id").notNull(),
// 		sessionId: text("session_id").notNull(),
// 	},
// 	(t) => ({
// 		pk: primaryKey({ columns: [t.sessionId, t.imageId] }),
// 	}),
// );
