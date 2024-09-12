import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "~/db";
import { characters } from "~/db/schema/characters";
import { handleDatabaseError, handleNotFound } from "~/lib/http-helpers";

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
