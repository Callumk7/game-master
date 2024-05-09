import { Hono } from "hono";
import { Bindings } from "..";
import { z } from "zod";
import {
	INTENT,
	IntentSchema,
	createDrizzleForTurso,
	getNote,
	getNoteAndLinkedEntities,
	notes,
	notesInsertSchema,
	updateNoteContent,
	updateNoteName,
	updateNoteSchema,
} from "@repo/db";
import { getIntentOrThrow, internalServerError } from "~/utils";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { zx } from "zodix";

type Variables = {
	intent: INTENT;
};

export const notesRoute = new Hono<{ Bindings: Bindings; Variables: Variables }>();

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
		throw internalServerError();
	}
});
notesRoute.patch("/:noteId", async (c) => {
	const noteId = c.req.param("noteId");
	const { intent, name, htmlContent } = await zx.parseForm(c.req.raw, updateNoteSchema);
	const db = createDrizzleForTurso(c.env);
	switch (intent) {
		case INTENT.UPDATE_NAME: {
			if (name) {
				console.log(`Parsing name was a success: ${name}`);
				await updateNoteName(db, noteId, name);
			}

			c.status(StatusCodes.NO_CONTENT);
			return c.body(null);
		}
		case INTENT.UPDATE_CONTENT: {
			if (htmlContent) {
				console.log(`Parsing name was a success: ${htmlContent}`);
				await updateNoteContent(db, noteId, htmlContent);
			}

			c.status(StatusCodes.NO_CONTENT);
			return c.body(null);
		}

		default:
			break;
	}

	return c.text("Got here and nothing has worked correctly");
});
