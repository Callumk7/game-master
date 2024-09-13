import {
	createCharacterSchema,
	updateCharacterSchema,
} from "@repo/api/dist/types/characters";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "~/db";
import { characters } from "~/db/schema/characters";
import {
	basicSuccessResponse,
	handleDatabaseError,
	handleNotFound,
	successResponse,
	validateOrThrowError,
} from "~/lib/http-helpers";
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
		const newChar = await db
			.insert(characters)
			.values(newCharacterInsert)
			.returning();
		return successResponse(c, newChar);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

characterRoute.delete("/:charId", async (c) => {
	const charId = c.req.param("charId");
	try {
		await db.delete(characters).where(eq(characters.id, charId));
		return basicSuccessResponse(c);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

characterRoute.patch("/:charId", async (c) => {
	const charId = c.req.param("charId");
	const data = await validateOrThrowError(updateCharacterSchema, c);

	try {
		const charUpdate = await db
			.update(characters)
			.set(data)
			.where(eq(characters.id, charId))
			.returning();
		return successResponse(c, charUpdate);
	} catch (error) {
		handleDatabaseError(c, error);
	}
});

