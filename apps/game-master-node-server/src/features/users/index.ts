import { newUserSchema } from "@repo/api";
import { uuidv4 } from "callum-util";
import { Hono } from "hono";
import { db } from "~/db";
import { users } from "~/db/schema/users";
import {
	handleDatabaseError,
	handleNotFound,
	validateOrThrowError,
} from "~/lib/http-helpers";
import type { Variables } from "~/types";
import { getSidebarData, getUser, getUserGames } from "./queries";

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
})

// TODO: Delete users

// TODO: Edit users

// WARN: This is likely not required anymore, so get ready to remove
usersRoute.get("/:userId/sidebar", async (c) => {
	const userId = c.req.param("userId");

	try {
		const sidebarData = await getSidebarData(userId);
		return c.json(sidebarData);
	} catch (error) {
		console.log(error);
		return handleDatabaseError(c, error);
	}
});
