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
	badRequestResponse,
	handleDatabaseError,
	handleNotFound,
	validateOrThrowError,
} from "~/lib/http-helpers";
import { getOwnedGamesWithConnections, getSidebarData, getUser } from "./queries";

export const usersRoute = new Hono();

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

// TODO: Delete users

// TODO: Edit users

usersRoute.get("/:userId/games", async (c) => {
	const userId = c.req.param("userId");

	// should only be "nested", "flat" or "sidebar"
	const withData = c.req.query().withData;

	if (!withData || !["nested", "flat", "sidebar"].includes(withData)) {
		return badRequestResponse("withData param not provided or was not correct value");
	}

	if (withData === "nested") {
		try {
			const allGames = await getOwnedGamesWithConnections(userId);
			return c.json(allGames);
		} catch (error) {
			return handleDatabaseError(c, error);
		}
	}

	if (withData === "flat") {
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

	if (withData === "sidebar") {
		try {
			const sidebarData = await getSidebarData(userId);
			if (!sidebarData) {
				return handleNotFound(c);
			}
			return c.json(sidebarData);
		} catch (error) {
			return handleDatabaseError(c, error);
		}
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
