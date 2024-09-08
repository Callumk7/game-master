import { createNoteSchema } from "@repo/api";
import { Hono } from "hono";
import { db } from "~/db";
import { notes } from "~/db/schema/notes";
import { handleDatabaseError, successResponse, validateOrThrowError } from "~/lib/http-helpers";
import { createNoteInsert } from "./util";

export const notesRoute = new Hono();

notesRoute.post("/", async (c) => {
	const data = await validateOrThrowError(createNoteSchema, c);

	const newNote = createNoteInsert(data)

	try {
		await db.insert(notes).values(newNote);
		return successResponse(c, newNote);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});
