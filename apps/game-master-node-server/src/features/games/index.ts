import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
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

const getGameDetailsRequestSchema = z.object({
	withMembers: z.boolean().optional(),
	withNotes: z.boolean().optional(),
});

gamesRoute.get("/:gameId", async (c) => {
	const gameId = c.req.param("gameId");
	const body = await c.req.json().catch((error) => {
		const errMessage = "Request to /:gameId failed due to json parsing error";
		console.error(errMessage);
		console.error(error);
		return c.text(errMessage, 400);
	});
	const result = getGameDetailsRequestSchema.safeParse(body);
	if (!result.success) {
		return c.text("No good, the request body was in a bad format.");
	}

	try {
		const game = await db.query.games.findMany({
			where: eq(games.id, gameId),
			with: {
				members: result.data.withMembers ? true : undefined,
				notes: result.data.withNotes ? true : undefined,
			},
		});

		return successResponse(c, game);
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
