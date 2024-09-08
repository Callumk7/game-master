import { createNoteSchema } from "@repo/api";
import { Hono } from "hono";
import { db } from "~/db";
import { notes, type InsertDatabaseNote } from "~/db/schema/notes";
import { handleDatabaseError, validateOrThrowError } from "~/lib/http-helpers";
import { generateNoteId } from "~/lib/ids";

export const notesRoute = new Hono();

notesRoute.post("/", async (c) => {
	const data = await validateOrThrowError(createNoteSchema, c);

	const currentDate = new Date();

	const newNote: InsertDatabaseNote = {
		id: generateNoteId(),
		name: data.name,
		ownerId: data.ownerId,
		createdAt: currentDate,
		updatedAt: currentDate,
		gameId: data.gameId,
		htmlContent: data.htmlContent,
	};

	try {
		await db.insert(notes).values(newNote);
		return c.json({ success: true, data: newNote }, 201);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});
