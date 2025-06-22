import { Hono } from "hono";
import { handleDatabaseError } from "~/lib/http-helpers";
import { getUserGames } from "./queries";

export const usersRoute = new Hono();

usersRoute.get("/:userId/games", async (c) => {
	const userId = c.req.param("userId");

	try {
		const gamesResult = await getUserGames(userId);
		return c.json(gamesResult);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});
