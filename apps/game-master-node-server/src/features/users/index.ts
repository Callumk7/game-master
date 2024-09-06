import type { User } from "@repo/shared-types";
import { uuidv4 } from "callum-util";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { db } from "~/db";
import { games } from "~/db/schema/games";
import { users } from "~/db/schema/users";
import {
	handleDatabaseError,
	handleNotFound,
	successResponse,
	validateOrThrowError,
} from "~/lib/http-helpers";

export const usersRoute = new Hono();

// TODO: write tests
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

const newUserSchema = z.object({
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	username: z.string(),
	email: z.string().email(),
	passwordHash: z.string(),
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

usersRoute.get("/:userId/games/owned", async (c) => {
	const userId = c.req.param("userId");
	try {
		const result = await db.select().from(games).where(eq(games.ownerId, userId));
		return c.json(result);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});
