import type { Id, User } from "@repo/api";
import { eq } from "drizzle-orm";
import { db } from "~/db";
import { games } from "~/db/schema/games";
import { users } from "~/db/schema/users";

export const getOwnedGamesWithConnections = async (userId: Id) => {
	return await db.query.games.findMany({
		where: eq(games.ownerId, userId),
		with: {
			notes: true,
			characters: {
				with: {
					notes: {
						columns: {
							noteId: true,
						},
					},
				},
			},
			factions: {
				with: {
					notes: {
						columns: {
							noteId: true,
						},
					},
					members: {
						columns: {
							characterId: true,
						},
					},
				},
			},
		},
	});
};

export const getUser = async (userId: Id): Promise<User | undefined> => {
	return await db
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
};
