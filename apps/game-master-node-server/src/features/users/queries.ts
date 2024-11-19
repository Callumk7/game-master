import type { Game, Id, User } from "@repo/api";
import { eq } from "drizzle-orm";
import { db } from "~/db";
import { usersToGames } from "~/db/schema/games";
import { users } from "~/db/schema/users";

export const getUser = async (userId: Id): Promise<User> => {
	const userResult = await db
		.select({
			id: users.id,
			firstName: users.firstName,
			lastName: users.lastName,
			username: users.username,
			email: users.email,
		})
		.from(users)
		.where(eq(users.id, userId))
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
