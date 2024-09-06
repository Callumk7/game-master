import { uuidv4 } from "callum-util";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { db } from "~/db";
import { games, type InsertDatabaseGame } from "~/db/schema/games";
import {
	handleDatabaseError,
	successResponse,
	validateOrThrowError,
} from "~/lib/http-helpers";
import { createGameNote } from "./mutations";
import { generateGameId } from "~/lib/ids";

export const gamesRoute = new Hono();

const createGameSchema = z.object({
	name: z.string(),
	ownerId: z.string(),
});

gamesRoute.post("/", async (c) => {
	const data = await validateOrThrowError(createGameSchema, c);

	const newGame: InsertDatabaseGame = {
		id: generateGameId(),
		name: data.name,
		ownerId: data.ownerId,
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	try {
		await db.insert(games).values(newGame);
		return c.json({ success: true, newGame }, 201);
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

const newNoteSchema = z.object({
	name: z.string(),
	content: z.string().optional(),
	htmlContent: z.string(),
	ownerId: z.string(),
	type: z.string().optional(),
});
gamesRoute.post("/:gameId/notes", async (c) => {
	const gameId = c.req.param("gameId");
	const data = await validateOrThrowError(newNoteSchema, c);
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

