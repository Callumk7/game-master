import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "~/db";
import { games, usersToGames } from "~/db/schema/games";
import {
	basicSuccessResponse,
	handleDatabaseError,
	successResponse,
	validateOrThrowError,
} from "~/lib/http-helpers";
import { createGameNote } from "./mutations";
import { createGameSchema, createNoteSchema, updateGameSchema } from "@repo/api";
import { createGameInsert } from "./util";
import { notes } from "~/db/schema/notes";
import { characters } from "~/db/schema/characters";
import { StatusCodes } from "http-status-codes";

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
		return successResponse(c, newGame, StatusCodes.CREATED);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

gamesRoute.get("/:gameId", async (c) => {
	const gameId = c.req.param("gameId");
	try {
		const game = await db
			.select()
			.from(games)
			.where(eq(games.id, gameId))
			.then((result) => result[0]);
		return c.json(game);
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
