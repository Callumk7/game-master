import {
	addMemberSchema,
	createGameSchema,
	createNoteSchema,
	updateGameMembersSchema,
	updateGameSchema,
	updateMemberSchema,
} from "@repo/api";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "~/db";
import { characters } from "~/db/schema/characters";
import { games, usersToGames } from "~/db/schema/games";
import { notes } from "~/db/schema/notes";
import {
	basicSuccessResponse,
	handleDatabaseError,
	handleNotFound,
	successResponse,
	validateOrThrowError,
} from "~/lib/http-helpers";
import { createGameNote } from "./mutations";
import { createGameInsert, findMembersToAddAndRemove } from "./util";
import { factions } from "~/db/schema/factions";
import {
	deleteMembers,
	getGameWithMembers,
	getMemberIdArray,
	handleAddMembers,
	handleRemoveMembers,
} from "./queries";
import { itemOrArrayToArray } from "~/utils";

export const gamesRoute = new Hono();

gamesRoute.post("/", async (c) => {
	const data = await validateOrThrowError(createGameSchema, c);
	const newGameInsert = createGameInsert(data);

	try {
		const newGame = await db
			.insert(games)
			.values(newGameInsert)
			.returning()
			.then((result) => result[0]);
		await db.insert(usersToGames).values({
			gameId: newGameInsert.id,
			userId: newGameInsert.ownerId,
			isOwner: true,
		});
		return successResponse(c, newGame);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

gamesRoute.get("/:gameId", async (c) => {
	const gameId = c.req.param("gameId");

	const withMembers = c.req.query().withMembers;
	if (withMembers) {
		try {
			const gameWithMembers = await getGameWithMembers(gameId);
			if (!gameWithMembers) {
				return handleNotFound(c);
			}
			return c.json(gameWithMembers);
		} catch (error) {
			return handleDatabaseError(c, error);
		}
	}

	try {
		const gameData = await db.query.games.findFirst({
			where: eq(games.id, gameId),
		});

		if (!gameData) {
			return handleNotFound(c);
		}

		return c.json(gameData);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

gamesRoute.patch("/:gameId", async (c) => {
	const gameId = c.req.param("gameId");
	const data = await validateOrThrowError(updateGameSchema, c);
	try {
		const updatedGame = await db
			.update(games)
			.set(data)
			.where(eq(games.id, gameId))
			.returning();
		return successResponse(c, updatedGame);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

gamesRoute.delete("/:gameId", async (c) => {
	const gameId = c.req.param("gameId");
	try {
		await db.delete(games).where(eq(games.id, gameId)); // TODO: Delete all joins
		return basicSuccessResponse(c);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

gamesRoute.get("/:gameId/entities", async (c) => {
	const gameId = c.req.param("gameId");
	try {
		const gameData = await db.query.games
			.findFirst({
				where: eq(games.id, gameId),
				with: {
					characters: {
						columns: {
							id: true,
							name: true,
							gameId: true,
						},
					},
					factions: {
						columns: {
							id: true,
							name: true,
							gameId: true,
						},
					},
					notes: {
						columns: {
							id: true,
							name: true,
							gameId: true,
						},
					},
				},
			})
			.then((result) => ({
				characters: result?.characters ?? [],
				factions: result?.factions ?? [],
				notes: result?.notes ?? [],
			}));
		return c.json(gameData);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

gamesRoute.get("/:gameId/notes", async (c) => {
	const gameId = c.req.param("gameId");
	try {
		const gameNotes = await db.select().from(notes).where(eq(notes.gameId, gameId));
		return c.json(gameNotes);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

gamesRoute.post("/:gameId/notes", async (c) => {
	const gameId = c.req.param("gameId");
	const data = await validateOrThrowError(createNoteSchema, c);
	try {
		const newNote = await createGameNote(data.ownerId, {
			name: data.name,
			htmlContent: data.htmlContent,
			gameId,
		});
		return successResponse(c, newNote);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

gamesRoute.get("/:gameId/users/:userId/notes", async (c) => {
	const { gameId, userId } = c.req.param();
	try {
		const userGames = await db
			.select()
			.from(notes)
			.where(and(eq(notes.gameId, gameId), eq(notes.ownerId, userId)));
		return c.json(userGames);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

////////////////////////////////////////////////////////////////////////////////
//                                Character Stuff
////////////////////////////////////////////////////////////////////////////////

gamesRoute.get("/:gameId/characters", async (c) => {
	const gameId = c.req.param("gameId");
	try {
		const gameCharacters = await db.query.characters.findMany({
			where: eq(characters.gameId, gameId),
		});
		return c.json(gameCharacters);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

gamesRoute.get("/:gameId/users/:userId/characters", async (c) => {
	const { gameId, userId } = c.req.param();
	try {
		const userChars = await db.query.characters.findMany({
			where: and(eq(characters.gameId, gameId), eq(characters.ownerId, userId)),
		});
		return c.json(userChars);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

////////////////////////////////////////////////////////////////////////////////
//                                Faction Stuff
////////////////////////////////////////////////////////////////////////////////

gamesRoute.get("/:gameId/factions", async (c) => {
	const gameId = c.req.param("gameId");
	try {
		const gameFactions = await db.query.factions.findMany({
			where: eq(factions.gameId, gameId),
		});
		return c.json(gameFactions);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

////////////////////////////////////////////////////////////////////////////////
//                                Member Stuff
////////////////////////////////////////////////////////////////////////////////

gamesRoute.post("/:gameId/members", async (c) => {
	const gameId = c.req.param("gameId");
	const data = await validateOrThrowError(addMemberSchema, c);

	try {
		const newMember = await db
			.insert(usersToGames)
			.values({ gameId, userId: data.userId })
			.returning()
			.onConflictDoNothing();
		return successResponse(c, newMember);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

gamesRoute.delete("/:gameId/members/:userId", async (c) => {
	const { gameId, userId } = c.req.param();
	try {
		await db
			.delete(usersToGames)
			.where(and(eq(usersToGames.userId, userId), eq(usersToGames.gameId, gameId)));
		return basicSuccessResponse(c);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

gamesRoute.patch("/:gameId/members/:userId", async (c) => {
	const { gameId, userId } = c.req.param();
	const data = await validateOrThrowError(updateMemberSchema, c);
	try {
		const result = await db
			.update(usersToGames)
			.set(data)
			.where(and(eq(usersToGames.userId, userId), eq(usersToGames.gameId, gameId)))
			.returning()
			.then((rows) => rows[0]);

		if (!result) {
			return handleNotFound(c);
		}

		return successResponse(c, result);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

gamesRoute.put("/:gameId/members", async (c) => {
	const gameId = c.req.param("gameId");

	const data = await validateOrThrowError(updateGameMembersSchema, c);
	const userIds = itemOrArrayToArray(data.userIds);

	// if there are no userIds, then we just want to delete all users (apart from owner?)
	if (userIds.length === 0) {
		try {
			await deleteMembers(gameId);
			return basicSuccessResponse(c);
		} catch (error) {
			// handle database error
			return handleDatabaseError(c, error);
		}
	}

	// otherwise, we can process the data
	try {
		const currentMembers = await getMemberIdArray(gameId);

		const { membersToAdd, membersToRemove } = findMembersToAddAndRemove(
			currentMembers,
			userIds,
		);
		try {
			await handleAddMembers(gameId, membersToAdd);
		} catch (error) {
			return handleDatabaseError(c, error);
		}

		try {
			await handleRemoveMembers(gameId, membersToRemove);
		} catch (error) {
			return handleDatabaseError(c, error);
		}

		return successResponse(c, { gameId, userIds });
	} catch (error) {
		// This will catch errors from getting current members from the database,
		// line 290
		return handleDatabaseError(c, error);
	}
});
