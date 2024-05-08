import { Hono } from "hono";
import { Bindings } from "..";
import { createDrizzleForTurso } from "@repo/db/drizzle";
import { characters } from "@repo/db/schema";

export const charactersRoute = new Hono<{ Bindings: Bindings }>();

charactersRoute.get("/", async (c) => {
	const db = createDrizzleForTurso(c.env);
	const allCharacters = await db.select().from(characters);
	return c.json(allCharacters);
});
