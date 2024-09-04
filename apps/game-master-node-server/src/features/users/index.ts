import { zValidator } from "@hono/zod-validator";
import { uuidv4 } from "callum-util";
import { Hono } from "hono";
import { z } from "zod";
import { db } from "~/db";
import { users } from "~/db/schema/users";

export const usersRoute = new Hono();

export const newUserSchema = z.object({
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	username: z.string(),
	email: z.string().email(),
	passwordHash: z.string(),
});

usersRoute.post("/", zValidator("json", newUserSchema), async (c) => {
	const data = c.req.valid("json");
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
		// TODO: How are we going to handle errors?
		console.error(error);
	}
});

