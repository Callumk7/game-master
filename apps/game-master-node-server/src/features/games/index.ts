import { uuidv4 } from "callum-util";
import { Hono } from "hono";
import { z } from "zod";
import { db } from "~/db";
import { games, type InsertDatabaseGame } from "~/db/schema/games";
import { handleDatabaseError, validateOrThrowError } from "~/lib/http-helpers";

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

function generateGameId() {
	return `game_${uuidv4()}`;
}
