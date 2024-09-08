import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "~/db";
import { games } from "~/db/schema/games";
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

export const gamesRoute = new Hono();

gamesRoute.post("/", async (c) => {
	const data = await validateOrThrowError(createGameSchema, c);
	const newGameInsert = createGameInsert(data);

	try {
		const newGame = await db.insert(games).values(newGameInsert).returning();
		return successResponse(c, newGame);
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

gamesRoute.get("/:gameId/notes", async (c) => {
	const gameId = c.req.param("gameId");
	try {
		const gameNotes = await db.select().from(notes).where(eq(notes.gameId, gameId));
		return c.json(gameNotes);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});
