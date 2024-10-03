import { newUserSchema } from "@repo/api";
import { uuidv4 } from "callum-util";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "~/db";
import { characters } from "~/db/schema/characters";
import { games } from "~/db/schema/games";
import { notes } from "~/db/schema/notes";
import { users } from "~/db/schema/users";
import {
	handleDatabaseError,
	handleNotFound,
	validateOrThrowError,
} from "~/lib/http-helpers";
import { getOwnedGamesWithConnections, getUser } from "./queries";

export const usersRoute = new Hono();

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

	const withData = c.req.query().withData;
	const nested = c.req.query().nested;

	if (withData === "true") {
		if (nested === "true") {
			try {
				const allGames = await getOwnedGamesWithConnections(userId);
				return c.json(allGames);
			} catch (error) {
				return handleDatabaseError(c, error);
			}
		}
		try {
			const allGames = await db.query.games.findMany({
				where: eq(games.ownerId, userId),
				with: {
					notes: true,
					characters: true,
					factions: true,
				},
			});
			return c.json(allGames);
		} catch (error) {
			return handleDatabaseError(c, error);
		}
	}

	try {
		const ownedGames = await db.select().from(games).where(eq(games.ownerId, userId));
		return c.json(ownedGames);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

usersRoute.get("/:userId/notes", async (c) => {
	const userId = c.req.param("userId");
	try {
		const allUserNotes = await db
			.select()
			.from(notes)
			.where(eq(notes.ownerId, userId));
		return c.json(allUserNotes);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

////////////////////////////////////////////////////////////////////////////////
//                                Character Stuff
////////////////////////////////////////////////////////////////////////////////

usersRoute.get("/:userId/chracters", async (c) => {
	const userId = c.req.param("userId");
	try {
		const userChars = await db.query.characters.findMany({
			where: eq(characters.ownerId, userId),
		});
		return c.json(userChars);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});
