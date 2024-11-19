import { baseUserSchema, newUserSchema } from "@repo/api";
import { uuidv4 } from "callum-util";
import { Hono } from "hono";
import { db } from "~/db";
import { users } from "~/db/schema/users";
import {
	handleDatabaseError,
	handleNotFound,
	successResponse,
	validateOrThrowError,
} from "~/lib/http-helpers";
import type { Variables } from "~/types";
import { getUser, getUserGames } from "./queries";
import { eq } from "drizzle-orm";

export const usersRoute = new Hono<{ Variables: Variables }>();

usersRoute.get("/", async (c) => {
	const { limit, offset } = c.req.query();
	let queryLimit = 50;
	let queryOffset = 0;
	if (limit) queryLimit = Number(limit);
	if (offset) queryOffset = Number(offset);

	try {
		const usersResult = await db.query.users.findMany({
			limit: queryLimit,
			offset: queryOffset,
		});
		return c.json(usersResult);
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

usersRoute.get("/:userId", async (c) => {
	const userId = c.req.param("userId");

	try {
		const result = await getUser(userId);
		if (!result) {
			return handleNotFound(c);
		}
		return c.json(result);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

usersRoute.get("/:userId/games", async (c) => {
	const userId = c.req.param("userId");

	try {
		const gamesResult = await getUserGames(userId);
		return c.json(gamesResult);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

usersRoute.patch("/:userId", async (c) => {
	const userId = c.req.param("userId");
	const data = await validateOrThrowError(baseUserSchema, c);
	try {
		const result = await db
			.update(users)
			.set(data)
			.where(eq(users.id, userId))
			.returning()
			.then((rows) => rows[0]);
		return successResponse(c, result);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

// NOTE: There is currently not any delete user functionality in the 
// http server. The whole process for data deletion and recovery should 
// probably have a more robust process than it does right now - we could
// do with a history and recovery db and feature set
