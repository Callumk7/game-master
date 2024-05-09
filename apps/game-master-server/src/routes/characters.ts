import { Hono } from "hono";
import type { Bindings } from "..";
import {
	CharacterInsert,
	characters,
	createCharacterRequest,
	createDrizzleForTurso,
	getFullCharacterData,
} from "@repo/db";
import { uuidv4 } from "callum-util";
import { eq } from "drizzle-orm";

export const charactersRoute = new Hono<{ Bindings: Bindings }>();

charactersRoute.get("/", async (c) => {
	const db = createDrizzleForTurso(c.env);
	const allCharacters = await db.select().from(characters);
	return c.json(allCharacters);
});

charactersRoute.get("/:characterId", async (c) => {
	const db = createDrizzleForTurso(c.env);
	const characterId = c.req.param("characterId");

	// The user can provide some parameters for additional information
	// about the specified character:

	const isComplete = c.req.query("complete");
	if (isComplete) {
		const fullCharacter = await getFullCharacterData(db, characterId);
		return c.json(fullCharacter);
	}

	const baseCharacter = await db
		.select()
		.from(characters)
		.where(eq(characters.id, characterId));

	return c.json(baseCharacter[0]);
});

// The new character validator will throw a bad request if the
// request json body does not match the schema
charactersRoute.post("/", async (c) => {
	const newCharBody = await c.req.json();

	const db = createDrizzleForTurso(c.env);

	const characterInsert: CharacterInsert = {
		id: `char_${uuidv4()}`,
		...newCharBody,
	};

	const newChar = await db.insert(characters).values(characterInsert).returning();
	return c.json(newChar);
});
