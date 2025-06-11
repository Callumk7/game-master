import type { Game, Id } from "@repo/api";
import { eq } from "drizzle-orm";
import { db } from "~/db";
import { user } from "~/db/schema/auth";
import { usersToGames } from "~/db/schema/games";

export const getUser = async (userId: Id) => {
	const userResult = await db
		.select({
			id: user.id,
			username: user.name,
			email: user.email,
		})
		.from(user)
		.where(eq(user.id, userId))
		.then((rows) => rows[0]);

	if (!userResult) {
		throw new Error("Error finding user in the database");
	}

	return userResult;
};

export const getUserGames = async (userId: Id): Promise<Game[]> => {
	const gamesResult = await db.query.usersToGames
		.findMany({
			where: eq(usersToGames.userId, userId),
			with: { game: true },
		})
		.then((result) => result.map((rows) => rows.game));

	return gamesResult;
};
