import { Hono } from "hono";
import type { Bindings } from "..";
import {
	CharacterInsert,
	characters,
	createCharacterRequest,
	createDrizzleForTurso,
} from "@repo/db";
import { uuidv4 } from "callum-util";

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
	const characterInsert: CharacterInsert = {
		id: `char_${uuidv4()}`,
		...character,
	};
	const newChar = await db.insert(characters).values(characterInsert).returning();
	return c.json(newChar);
});
