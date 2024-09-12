import { createCharacterSchema } from "@repo/api/dist/types/characters";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "~/db";
import { characters } from "~/db/schema/characters";
import { handleDatabaseError, handleNotFound, successResponse, validateOrThrowError } from "~/lib/http-helpers";
import { createCharacterInsert } from "./util";

export const characterRoute = new Hono();

characterRoute.get("/:charId", async (c) => {
	const charId = c.req.param("charId");
	try {
		const characterResult = await db.query.characters.findFirst({
			where: eq(characters.id, charId),
		});
		if (!characterResult) {
			return handleNotFound(c);
		}
		return c.json(characterResult);
	} catch (error) { 
		return handleDatabaseError(c, error);
	}
});

characterRoute.post("/", async (c) => {
	const data = await validateOrThrowError(createCharacterSchema, c);

	const newCharacterInsert = createCharacterInsert(data);

	try {
		const newChar = await db.insert(characters).values(newCharacterInsert).returning();
		return successResponse(c, newChar);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
})
