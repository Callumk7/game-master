import { Hono } from "hono";
import type { Bindings } from "..";
import { createDrizzleForTurso } from "@repo/db";
import { characters } from "@repo/db";
import { createCharacterRequest } from "@repo/db";

export const charactersRoute = new Hono<{ Bindings: Bindings }>();

charactersRoute.get("/", async (c) => {
	const db = createDrizzleForTurso(c.env);
	const allCharacters = await db.select().from(characters);
	return c.json(allCharacters);
});

charactersRoute.post("/", async (c) => {
	const body = await c.req.json();
	const db = createDrizzleForTurso(c.env);
	const character = createCharacterRequest.parse(body);
});
