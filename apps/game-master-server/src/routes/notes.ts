import { Hono } from "hono";
import { createDrizzleForTurso } from "~/db";
import { Bindings } from "..";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import {
	deleteCharacterJoinsFromNote,
	deleteFactionJoinsFromNote,
	getAllNotesWithRelations,
	getNote,
	getNoteAndLinkedEntities,
	linkCharactersToNote,
	linkFactionsToNote,
} from "~/api/notes";
import { notes } from "~/db/schemas/notes";
import { NoteInsert, notesInsertSchema } from "~/types";
import { OptionalEntitySchema } from "~/types/zod";
import { handleLinkEntitiesToTarget } from "~/api";
import { userIdValidator } from "~/lib/validators";

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

const newNoteValidator = zValidator(
	"json",
	z.object({
		id: z.string(),
		userId: z.string(),
		name: z.string(),
		htmlContent: z.string(),
		linked_characters: OptionalEntitySchema,
		linked_factions: OptionalEntitySchema,
	}),
);

notesRoute.use("/", async (c, next) => {
	const body = await c.req.json();
	console.log(body);
	await next();
})

notesRoute.post("/", newNoteValidator, async (c) => {
	const body = c.req.valid("json");
	const insert: NoteInsert = {
		id: body.id,
		name: body.name,
		userId: body.userId,
		htmlContent: body.htmlContent,
	};

	const db = createDrizzleForTurso(c.env);
	const newNote = await db.insert(notes).values(insert).returning();

	if (body.linked_characters) {
		await handleLinkEntitiesToTarget(
			db,
			body.linked_characters,
			body.id,
			deleteCharacterJoinsFromNote,
			linkCharactersToNote,
		);
	}
	if (body.linked_factions) {
		await handleLinkEntitiesToTarget(
			db,
			body.linked_factions,
			body.id,
			deleteFactionJoinsFromNote,
			linkFactionsToNote,
		);
	}

	console.log("New note, created:");
	console.log(newNote);

	return c.json(newNote);
});
