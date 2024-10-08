import type { GameWithMembers, Id } from "@repo/api";
import { and, eq, inArray } from "drizzle-orm";
import type { Context } from "hono";
import { db } from "~/db";
import { games, usersToGames } from "~/db/schema/games";
import { handleDatabaseError } from "~/lib/http-helpers";

export const getGameWithMembers = async (
	gameId: Id,
): Promise<GameWithMembers | undefined> => {
	const game = await db.query.games.findFirst({
		where: eq(games.id, gameId),
		with: {
			members: {
				with: {
					user: true,
				},
			},
		},
	});

	if (!game) {
		return undefined;
	}

	const transformedResult: GameWithMembers = {
		...game,
		members: game.members.map((m) => ({
			...m.user,
			role: m.role,
			isOwner: m.isOwner,
		})),
	};

	return transformedResult;
};

export const deleteMembers = async (gameId: Id) => {
	await db
		.delete(usersToGames)
		.where(and(eq(usersToGames.gameId, gameId), eq(usersToGames.isOwner, false)));
};

export const getMemberIdArray = async (gameId: Id): Promise<string[]> => {
	return await db
		.select({ userId: usersToGames.userId })
		.from(usersToGames)
		.where(eq(usersToGames.gameId, gameId))
		.then((rows) => rows.map((row) => row.userId));
};

export const handleAddMembers = async (gameId: Id, membersToAdd: Id[]) => {
	if (membersToAdd.length > 0) {
		const dbInsert = membersToAdd.map((member) => ({ userId: member, gameId }));
		await db.insert(usersToGames).values(dbInsert);
	}
};

export const handleRemoveMembers = async (gameId: Id, membersToRemove: Id[]) => {
	if (membersToRemove.length > 0) {
		await db
			.delete(usersToGames)
			.where(
				and(
					eq(usersToGames.gameId, gameId),
					inArray(usersToGames.userId, membersToRemove),
				),
			);
	}
};
