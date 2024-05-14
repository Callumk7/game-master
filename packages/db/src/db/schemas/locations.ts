import { relations } from "drizzle-orm";
import { primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./users";
import { notesOnLocations } from "./notes";
import { factions } from "./factions";
import { characters } from "./characters";
import { locationsInSessions } from "./sessions";

export const locations = sqliteTable("locations", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	description: text("description").notNull(),
	imageUrl: text("image_url"),
	userId: text("user_id").notNull(),
	parentLocationId: text("parent_location_id"),
});

export const locationsRelations = relations(locations, ({ one, many }) => ({
	user: one(users, {
		fields: [locations.userId],
		references: [users.id],
	}),
	parentLocation: one(locations, {
		fields: [locations.parentLocationId],
		references: [locations.id],
		relationName: "parent",
	}),
	childLocations: many(locations, { relationName: "child" }),
	notes: many(notesOnLocations),
	factions: many(factionLocations),
	characters: many(characterLocations),
	sessions: many(locationsInSessions),
}));

export const factionLocations = sqliteTable(
	"faction_locations",
	{
		locationId: text("location_id").notNull(),
		factionId: text("faction_id").notNull(),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.factionId, t.locationId] }),
	}),
);

export const factionLocationsRelations = relations(factionLocations, ({ one }) => ({
	faction: one(factions, {
		fields: [factionLocations.factionId],
		references: [factions.id],
	}),
	location: one(locations, {
		fields: [factionLocations.locationId],
		references: [locations.id],
	}),
}));

export const characterLocations = sqliteTable(
	"character_locations",
	{
		locationId: text("location_id").notNull(),
		characterId: text("character_id").notNull(),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.characterId, t.locationId] }),
	}),
);

export const characterLocationsRelations = relations(characterLocations, ({ one }) => ({
	character: one(characters, {
		fields: [characterLocations.characterId],
		references: [characters.id],
	}),
	location: one(locations, {
		fields: [characterLocations.locationId],
		references: [locations.id],
	}),
}));
