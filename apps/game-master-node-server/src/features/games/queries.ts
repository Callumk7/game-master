import type { GameWithMembers } from "@repo/api";
import { eq } from "drizzle-orm";
import { db } from "~/db";
import { games } from "~/db/schema/games";

export const getGameWithMembers = async (
	gameId: string,
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
