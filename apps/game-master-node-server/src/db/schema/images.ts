import { pgTable, text } from "drizzle-orm/pg-core";
import { users } from "./users";
import { notes } from "./notes";
import { characters } from "./characters";
import { factions } from "./factions";
import { relations } from "drizzle-orm";

export const images = pgTable("images", {
	id: text("id").notNull().primaryKey(),
	ownerId: text("owner_id")
		.notNull()
		.references(() => users.id),
	noteId: text("note_id").references(() => notes.id),
	characterId: text("character_id").references(() => characters.id),
	factionId: text("faction_id").references(() => factions.id),
	imageUrl: text("image_url").notNull(),
});

export const imageRelations = relations(images, ({ one }) => ({
	owner: one(users, {
		fields: [images.ownerId],
		references: [users.id],
	}),
	note: one(notes, {
		fields: [images.noteId],
		references: [notes.id]
	}),
	character: one(characters, {
		fields: [images.characterId],
		references: [characters.id]
	}),
	faction: one(factions, {
		fields: [images.factionId],
		references: [factions.id]
	})
}));
