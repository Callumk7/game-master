import { boolean, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { relations } from "drizzle-orm";
import { notes } from "./notes";

export const games = pgTable("games", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull(),
	ownerId: text("owner_id")
		.notNull()
		.references(() => users.id),
});

export const gamesRelations = relations(games, ({ one, many }) => ({
	owner: one(users, {
		fields: [games.ownerId],
		references: [users.id],
	}),
	members: many(usersToGames),
	notes: many(notes),
}));

export const usersToGames = pgTable(
	"users_to_games",
	{
		userId: text("user_id")
			.notNull()
			.references(() => users.id),
		gameId: text("game_id")
			.notNull()
			.references(() => games.id),
		isOwner: boolean("is_owner").notNull(),
	},
	(t) => ({ pk: primaryKey({ columns: [t.userId, t.gameId] }) }),
);

export const usersToGamesRelations = relations(usersToGames, ({ one, many }) => ({
	user: one(users, {
		fields: [usersToGames.userId],
		references: [users.id],
	}),
	game: one(games, {
		fields: [usersToGames.gameId],
		references: [games.id],
	}),
}));

