import type { Id } from "@repo/api";
import { eq } from "drizzle-orm";
import { db } from "~/db";
import { games } from "~/db/schema/games";

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
