import { zValidator } from "@hono/zod-validator";
import { uuidv4 } from "callum-util";
import { Hono } from "hono";
import { z } from "zod";
import { db } from "~/db";
import { games, type InsertDatabaseGame } from "~/db/schema/games";

export const gamesRoute = new Hono();

export const createGameSchema = z.object({
	name: z.string(),
	creatorId: z.string(),
});

gamesRoute.post("/", zValidator("json", createGameSchema), async (c) => {
	const data = c.req.valid("json");

	const newGame: InsertDatabaseGame = {
		id: generateGameId(),
		name: data.name,
		ownerId: data.creatorId,
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	try {
		await db.insert(games).values(newGame);
		return c.json({ success: true, newGame }, 201);
	} catch (error) {
		console.error(error);
		return c.json({success: false, error: error}, 401);
	}
});

function generateGameId() {
	return `game_${uuidv4()}`;
}
