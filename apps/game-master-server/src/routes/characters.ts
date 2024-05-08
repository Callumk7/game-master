import { Hono } from "hono";
import { Bindings } from "..";
import { characters } from "~/db/schemas/characters";
import { createDrizzleForTurso } from "@repo/db/db";

export const charactersRoute = new Hono<{ Bindings: Bindings }>();

charactersRoute.get("/", async (c) => {
	const db = createDrizzleForTurso(c.env);
	const allCharacters = await db.select().from(characters);
	return c.json(allCharacters);
});
