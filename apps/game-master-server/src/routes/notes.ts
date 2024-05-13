import { Hono } from "hono";
import { Bindings } from "..";
import { z } from "zod";
import {
	INTENT,
	LinkIntentSchema,
	Note,
	NoteInsert,
	OptionalEntitySchema,
	createDrizzleForTurso,
	getNote,
	getNoteAndLinkedEntities,
	handleNoteLinking,
	linkCharactersToNote,
	notes,
	notesInsertSchema,
	updateNoteContent,
	updateNoteName,
	updateNoteSchema,
} from "@repo/db";
import { internalServerError } from "~/utils";
import { StatusCodes } from "http-status-codes";
import { zx } from "zodix";
import { uuidv4 } from "callum-util";
import { eq } from "drizzle-orm";

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

// accepts formData, forwarded from remix. We have additional data based on
// if this is being linked to something straight away.
notesRoute.post("/", async (c) => {
	console.log("start of the note creation route");
	const result = await zx.parseFormSafe(
		c.req.raw,
		notesInsertSchema.omit({ id: true }).extend({
			links: zx.BoolAsString.optional(),
			linkIds: OptionalEntitySchema,
			intent: LinkIntentSchema.optional(),
		}),
	);

	if (!result.success) {
		console.log(result.error);
		throw internalServerError();
	}

	const { data } = result;

	let newNote: Note;
	const db = createDrizzleForTurso(c.env);

	try {
		const noteInsert: NoteInsert = {
			id: `note_${uuidv4()}`,
			...data,
		};
		newNote = await db
			.insert(notes)
			.values(noteInsert)
			.returning()
			.then((result) => result[0]);
	} catch (err) {
		if (err instanceof z.ZodError) {
			console.log("Invalid Data", err.errors);
		} else {
			console.log("Unknown Error", err);
		}
		throw internalServerError();
	}

	if (data.links) {
		await handleNoteLinking(db, newNote.id, data.linkIds, data.intent!);
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
	const res = await handleNoteLinking(db, noteId, linkIds, intent);

	return res;
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
