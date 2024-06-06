import { Hono } from "hono";
import type { Bindings } from "..";
import {
	CharacterInsert,
	INTENT,
	IntentSchema,
	LinkIntentSchema,
	OptionalEntitySchema,
	badRequest,
	characters,
	charactersInFactions,
	charactersInSessions,
	charactersInsertSchema,
	createCharacter,
	createDrizzleForTurso,
	getAllUserCharacters,
	getFullCharacterData,
	handleAddLinkToCharacter,
	handleBulkCharacterLinking,
	linkFactionsToCharacter,
	noContent,
	notesOnCharacters,
	plotsOnCharacters,
} from "@repo/db";
import { uuidv4 } from "callum-util";
import { eq } from "drizzle-orm";
import { zx } from "zodix";
import { getCharacterFactions, getCharacterSessions } from "~/database/characters";
import { z } from "zod";

export const charactersRoute = new Hono<{ Bindings: Bindings }>();

// User specific characters
charactersRoute.get("/", async (c) => {
	const { userId } = c.req.query();
	if (!userId) {
		return badRequest("No userId provided");
	}
	const db = createDrizzleForTurso(c.env);
	const allCharacters = await getAllUserCharacters(db, userId);
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

	// TODO: isn't this a function?
	const baseCharacter = await db
		.select()
		.from(characters)
		.where(eq(characters.id, characterId));

	return c.json(baseCharacter[0]);
});

charactersRoute.post("/", async (c) => {
	const newCharBody = await zx.parseForm(
		c.req.raw,
		charactersInsertSchema.omit({ bio: true, id: true }),
	);

	const db = createDrizzleForTurso(c.env);

	const characterInsert: CharacterInsert = {
		id: `char_${uuidv4()}`,
		bio: "The description of the character",
		...newCharBody,
	};

	const newChar = await createCharacter(db, characterInsert);
	return c.json(newChar);
});

charactersRoute.patch("/:characterId", async (c) => {
	console.log("patching a character");
	const characterId = c.req.param("characterId");
	const { intent } = await zx.parseForm(c.req.raw, {
		intent: IntentSchema,
	});

	const db = createDrizzleForTurso(c.env);
	switch (intent) {
		case INTENT.UPDATE_CONTENT: {
			const { bio } = await zx.parseForm(c.req.raw, { bio: z.string() });
			await db
				.update(characters)
				.set({ bio })
				.where(eq(characters.id, characterId));
			break;
		}
		case INTENT.UPDATE_NAME:
		case INTENT.UPDATE_CONNECTIONS:
		case INTENT.UPDATE_BIO:
			break;

		default:
			break;
	}

	return c.json("done");
});

// Post a single link to the character
charactersRoute.post("/:characterId/links", async (c) => {
	const characterId = c.req.param("characterId");

	const { intent, targetId } = await zx.parseForm(c.req.raw, {
		intent: LinkIntentSchema,
		targetId: z.string(),
	});

	const db = createDrizzleForTurso(c.env);
	return await handleAddLinkToCharacter(db, characterId, targetId, intent);
});

// Put removes all links and replaces them with the request
charactersRoute.put("/:characterId/links", async (c) => {
	const characterId = c.req.param("characterId");

	const { intent, targetIds } = await zx.parseForm(c.req.raw, {
		intent: LinkIntentSchema,
		targetIds: OptionalEntitySchema,
	});

	const db = createDrizzleForTurso(c.env);
	return await handleBulkCharacterLinking(db, characterId, targetIds, intent);
});

charactersRoute.get("/:characterId/factions", async (c) => {
	const characterId = c.req.param("characterId");

	const db = createDrizzleForTurso(c.env);
	const characterFactions = await getCharacterFactions(db, characterId);

	return c.json(characterFactions);
});

// We should do this for each entity type, if the route needs to handle a specific type of link
charactersRoute.post("/:characterId/factions/:factionId", async (c) => {
	const { characterId, factionId } = c.req.param();
	const db = createDrizzleForTurso(c.env);
	const result = await linkFactionsToCharacter(db, characterId, [factionId]);
	return c.json(result);
});

charactersRoute.get("/:characterId/sessions", async (c) => {
	const characterId = c.req.param("characterId");

	const db = createDrizzleForTurso(c.env);
	const characterSessions = await getCharacterSessions(db, characterId);

	return c.json(characterSessions);
});

charactersRoute.delete("/:characterId", async (c) => {
	const characterId = c.req.param("characterId");

	const db = createDrizzleForTurso(c.env);
	const r1 = db.delete(characters).where(eq(characters.id, characterId));
	const r2 = db
		.delete(charactersInFactions)
		.where(eq(charactersInFactions.characterId, characterId));
	const r3 = db
		.delete(charactersInSessions)
		.where(eq(charactersInSessions.characterId, characterId));
	const r4 = db
		.delete(plotsOnCharacters)
		.where(eq(plotsOnCharacters.characterId, characterId));
	const r5 = db
		.delete(notesOnCharacters)
		.where(eq(notesOnCharacters.characterId, characterId));

	await Promise.all([r1, r2, r3, r4, r5]);

	return noContent();
});
