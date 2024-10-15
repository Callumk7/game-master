import type { Id, User, UserWithSidebarData } from "@repo/api";
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

export const getSidebarData = async (
	userId: Id,
): Promise<UserWithSidebarData | undefined> => {
	const result = await db.query.users.findFirst({
		where: eq(users.id, userId),
		columns: {
			id: true,
			firstName: true,
			lastName: true,
			username: true,
			email: true,
		},
		with: {
			games: {
				with: {
					game: {
						with: {
							notes: {
								columns: {
									id: true,
									name: true,
									gameId: true,
									createdAt: true,
									updatedAt: true,
								},
							},
							characters: {
								columns: {
									id: true,
									name: true,
									gameId: true,
									createdAt: true,
									updatedAt: true,
								},
							},
							factions: {
								columns: {
									id: true,
									name: true,
									gameId: true,
									createdAt: true,
									updatedAt: true,
								},
							},
							folders: {
								with: {
									notes: {
										columns: {
											id: true,
											name: true,
											gameId: true,
											createdAt: true,
											updatedAt: true,
										},
									},
									characters: {
										columns: {
											id: true,
											name: true,
											gameId: true,
											createdAt: true,
											updatedAt: true,
										},
									},
									factions: {
										columns: {
											id: true,
											name: true,
											gameId: true,
											createdAt: true,
											updatedAt: true,
										},
									},
								},
							},
						},
					},
				},
			},
		},
	});

	if (!result) {
		return undefined;
	}

	return {
		...result,
		games: result.games.map((game) => game.game),
	};
};
