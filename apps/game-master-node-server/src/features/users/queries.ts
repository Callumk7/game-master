import { eq } from "drizzle-orm";
import { db } from "~/db";
import { usersToGames } from "~/db/schema/games";

export async function getUserGames(userId: string) {
	const result = await db.query.usersToGames.findMany({
		where: eq(usersToGames.userId, userId),
		with: {
			game: true,
		},
	});

	return result.map((rows) => rows.game);
}
