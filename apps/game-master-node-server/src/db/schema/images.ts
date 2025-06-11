import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";
import { characters } from "./characters";
import { factions } from "./factions";
import { notes } from "./notes";
import { user } from "./auth";

export const images = pgTable("images", {
	id: text("id").notNull().primaryKey(),
	ownerId: text("owner_id")
		.notNull()
		.references(() => user.id),
	noteId: text("note_id").references(() => notes.id, { onDelete: "set null" }),
	characterId: text("character_id").references(() => characters.id, {
		onDelete: "set null",
	}),
	factionId: text("faction_id").references(() => factions.id, { onDelete: "set null" }),
	imageUrl: text("image_url").notNull(),
});

export const imageRelations = relations(images, ({ one }) => ({
	owner: one(user, {
		fields: [images.ownerId],
		references: [user.id],
	}),
	note: one(notes, {
		fields: [images.noteId],
		references: [notes.id],
	}),
	character: one(characters, {
		fields: [images.characterId],
		references: [characters.id],
	}),
	faction: one(factions, {
		fields: [images.factionId],
		references: [factions.id],
	}),
}));
