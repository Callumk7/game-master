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
import { user } from "./auth";
import { characters } from "./characters";
import { factions } from "./factions";
import { folders, notes } from "./notes";

export const games = pgTable("games", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	description: text("description"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull(),
	ownerId: text("owner_id")
		.notNull()
		.references(() => user.id),
});

export const gamesRelations = relations(games, ({ one, many }) => ({
	owner: one(user, {
		fields: [games.ownerId],
		references: [user.id],
	}),
	members: many(usersToGames),
	notes: many(notes),
	characters: many(characters),
	factions: many(factions),
	folders: many(folders),
}));

export const databaseSelectGameSchema = createSelectSchema(games);
export type DatabaseGame = z.infer<typeof databaseSelectGameSchema>;

export const databaseInsertGameSchema = createInsertSchema(games);
export type InsertDatabaseGame = z.infer<typeof databaseInsertGameSchema>;

export const roleEnum = pgEnum("role", ["admin", "dm", "player", "guest"]);

export const usersToGames = pgTable(
	"users_to_games",
	{
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		gameId: text("game_id")
			.notNull()
			.references(() => games.id, { onDelete: "cascade" }),
		isOwner: boolean("is_owner").notNull().default(false),
		role: roleEnum("role").notNull().default("player"),
	},
	(t) => ({ pk: primaryKey({ columns: [t.userId, t.gameId] }) }),
);

export const usersToGamesRelations = relations(usersToGames, ({ one }) => ({
	user: one(user, {
		fields: [usersToGames.userId],
		references: [user.id],
	}),
	game: one(games, {
		fields: [usersToGames.gameId],
		references: [games.id],
	}),
}));
