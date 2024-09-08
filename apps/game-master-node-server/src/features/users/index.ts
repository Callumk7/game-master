import { newUserSchema } from "@repo/api";
import { uuidv4 } from "callum-util";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "~/db";
import { games, usersToGames } from "~/db/schema/games";
import { users } from "~/db/schema/users";
import {
	handleDatabaseError,
	handleNotFound,
	successResponse,
	validateOrThrowError,
} from "~/lib/http-helpers";

export const usersRoute = new Hono();

usersRoute.get("/:userId", async (c) => {
	const userId = c.req.param("userId");

	try {
		const result = await db
			.select()
			.from(users)
			.where(eq(users.id, userId))
			.then((rows) => rows[0]);
		if (!result) {
			return handleNotFound(c);
		}
		return successResponse(c, result);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

usersRoute.post("/", async (c) => {
	const data = await validateOrThrowError(newUserSchema, c);
	try {
		const newUserData = await db
			.insert(users)
			.values({
				...data,
				id: `user_${uuidv4()}`,
			})
			.returning()
			.then((result) => result[0]);

		if (newUserData) {
			return c.json(newUserData, 201);
		}
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

// TODO: Delete users

// TODO: Edit users

usersRoute.get("/:userId/games", async (c) => {
	const userId = c.req.param("userId");
	const isOwned = c.req.query().owned;
	if (isOwned) {
		try {
			const ownedGames = await db
				.select()
				.from(games)
				.where(eq(games.ownerId, userId));
			return c.json(ownedGames);
		} catch (error) {
			return handleDatabaseError(c, error);
		}
	}

	try {
		const allGames = await db.query.usersToGames
			.findMany({
				where: eq(usersToGames.userId, userId),
				columns: {},
				with: {
					game: true,
				},
			})
			.then((rows) => rows.map((row) => row.game));
		return c.json(allGames);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});
