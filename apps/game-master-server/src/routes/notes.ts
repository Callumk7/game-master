import { Hono } from "hono";
import { Bindings } from "..";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import {
	OptionalEntitySchema,
	createDrizzleForTurso,
	getNote,
	getNoteAndLinkedEntities,
	notes,
	notesInsertSchema,
} from "@repo/db";
import { HTTPException } from "hono/http-exception";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

export const notesRoute = new Hono<{ Bindings: Bindings }>();

notesRoute.get("/:id", async (c) => {
	const db = createDrizzleForTurso(c.env);
	const noteId = c.req.param("id");

	const queryParams = c.req.query();
	if (queryParams.withRelations === "true") {
		const userNotes = await getNoteAndLinkedEntities(db, noteId);
		return c.json(userNotes);
	}
	const note = await getNote(db, noteId);
	return c.json(note);
});

// log the body of incoming requests
notesRoute.use("/", async (c, next) => {
	const body = await c.req.json();
	console.log(body);
	await next();
});

notesRoute.post("/", async (c) => {
	const noteBody = await c.req.json();
	try {
		const noteInsert = notesInsertSchema.parse(noteBody);
		const db = createDrizzleForTurso(c.env);
		const newNote = await db.insert(notes).values(noteInsert).returning();
		return c.json(newNote);
	} catch (err) {
		if (err instanceof z.ZodError) {
			console.log("Invalid Data", err.errors);
		} else {
			console.log("Unknown Error", err);
		}
		throw new HTTPException(StatusCodes.INTERNAL_SERVER_ERROR, {
			message: ReasonPhrases.INTERNAL_SERVER_ERROR,
		});
	}
});
