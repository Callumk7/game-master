import { Hono } from "hono";
import type { Bindings } from "..";
import { z } from "zod";
import {
	INTENT,
	LinkIntentSchema,
	type NoteInsert,
	OptionalEntitySchema,
	badRequest,
	createDrizzleForTurso,
	createNoteFromInsert,
	getNote,
	getNoteAndLinkedEntities,
	handleBulkNoteLinking,
	handleNoteLinking,
	linkCharactersToNote,
	notes,
	notesInsertSchema,
	updateNoteContent,
	updateNoteName,
	updateNoteSchema,
} from "@repo/db";
import { StatusCodes } from "http-status-codes";
import { zx } from "zodix";
import { uuidv4 } from "callum-util";
import { eq } from "drizzle-orm";
import { htmlToText } from "html-to-text";

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

notesRoute.post("/", async (c) => {
	const newNoteData = await zx.parseForm(
		c.req.raw,
		notesInsertSchema
			.extend({
				linkId: z.string().optional(),
				intent: LinkIntentSchema.optional(),
			})
			.omit({ id: true }),
	);

	const content = htmlToText(newNoteData.htmlContent);

	const newNoteInsert: NoteInsert = {
		id: `note_${uuidv4()}`,
		content,
		...newNoteData,
	};

	const db = createDrizzleForTurso(c.env);
	const newNote = await createNoteFromInsert(db, newNoteInsert);

	if (newNoteData.linkId) {
		if (!newNoteData.intent) {
			return badRequest("Missing link intent.");
		}

		return await handleNoteLinking(
			db,
			newNote.id,
			newNoteData.linkId,
			newNoteData.intent,
		);
	}

	return c.json(newNote);
});

notesRoute.post("/:noteId/links", async (c) => {
	const noteId = c.req.param("noteId");
	const { intent, linkIds } = await zx.parseForm(c.req.raw, {
		intent: LinkIntentSchema,
		linkIds: OptionalEntitySchema,
	});

	const db = createDrizzleForTurso(c.env);
	const res = await handleBulkNoteLinking(db, noteId, linkIds, intent);

	return res;
});

// Put is for bulk updating
notesRoute.put("/:noteId/links", async (c) => {
	const noteId = c.req.param("noteId");

	const { intent, linkIds } = await zx.parseForm(c.req.raw, {
		intent: LinkIntentSchema,
		linkIds: OptionalEntitySchema,
	});

	const db = createDrizzleForTurso(c.env);
	return await handleBulkNoteLinking(db, noteId, linkIds, intent);
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

notesRoute.delete("/:noteId", async (c) => {
	const noteId = c.req.param("noteId");
	const db = createDrizzleForTurso(c.env);

	await db.delete(notes).where(eq(notes.id, noteId));
	return c.text("Successfully deleted note");
});

notesRoute.post("/:noteId/characters/:characterId", async (c) => {
	const { characterId, noteId } = c.req.param();
	const db = createDrizzleForTurso(c.env);
	const result = await linkCharactersToNote(db, noteId, [characterId]);
	return c.json(result);
});
