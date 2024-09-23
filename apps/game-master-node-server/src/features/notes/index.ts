import {
	createNoteSchema,
	duplicateNoteSchema,
	linkNotesSchema,
	updateNoteContentSchema,
	type Id,
} from "@repo/api";
import { Hono } from "hono";
import { db } from "~/db";
import { links, notes } from "~/db/schema/notes";
import {
	basicSuccessResponse,
	handleDatabaseError,
	handleNotFound,
	successResponse,
	validateOrThrowError,
} from "~/lib/http-helpers";
import { createNoteInsert } from "./util";
import { eq } from "drizzle-orm";
import { generateNoteId } from "~/lib/ids";

export const notesRoute = new Hono();

const getNote = async (noteId: Id) => {
	return await db.query.notes.findFirst({
		where: eq(notes.id, noteId),
	});
};

// api.createNote
notesRoute.post("/", async (c) => {
	const data = await validateOrThrowError(createNoteSchema, c);

	const newNoteInsert = createNoteInsert(data);

	try {
		const newNote = await db
			.insert(notes)
			.values(newNoteInsert)
			.returning()
			.then((result) => result[0]);
		return successResponse(c, newNote);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

// api.getNote
notesRoute.get("/:noteId", async (c) => {
	const noteId = c.req.param("noteId");
	try {
		const note = await getNote(noteId);
		if (!note) return handleNotFound(c);
		return c.json(note);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

// api.updateNote
notesRoute.patch("/:noteId", async (c) => {
	const noteId = c.req.param("noteId");
	const data = await validateOrThrowError(updateNoteContentSchema, c);
	try {
		const noteUpdate = await db
			.update(notes)
			.set(data)
			.where(eq(notes.id, noteId))
			.returning();
		return successResponse(c, noteUpdate);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

// api.deleteNote
notesRoute.delete("/:noteId", async (c) => {
	const noteId = c.req.param("noteId");
	try {
		await db.delete(notes).where(eq(notes.id, noteId));
		return basicSuccessResponse(c);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

// api.duplicateNote
// TODO: handle duplicating all links
notesRoute.post("/:noteId/duplicate", async (c) => {
	const noteId = c.req.param("noteId");
	const data = await validateOrThrowError(duplicateNoteSchema, c);
	try {
		const note = await getNote(noteId);
		if (!note) return handleNotFound(c);
		const currentDate = new Date();
		const newNote = await db
			.insert(notes)
			.values({
				id: generateNoteId(),
				name: data.name,
				createdAt: currentDate,
				updatedAt: currentDate,
				ownerId: data.ownerId,
				type: note.type,
				content: note.content,
				htmlContent: note.htmlContent,
			})
			.returning()
			.then((result) => result[0]);
		return successResponse(c, newNote);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

////////////////////////////////////////////////////////////////////////////////
//                                Linking
////////////////////////////////////////////////////////////////////////////////

notesRoute.get("/:noteId/links/notes", async (c) => {
	const noteId = c.req.param("noteId");

	try {
		const backLinks = await db.query.links
			.findMany({
				where: eq(links.toId, noteId),
				with: {
					from: true,
				},
			})
			.then((result) => result.map((row) => row.from));
		const outgoingLinks = await db.query.links
			.findMany({
				where: eq(links.fromId, noteId),
				with: {
					to: true,
				},
			})
			.then((result) => result.map((row) => row.to));
		return c.json({ backLinks, outgoingLinks });
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

notesRoute.post("/:noteId/links/notes", async (c) => {
	const fromId = c.req.param("noteId"); // note id is always the fromId
	const { toIds } = await validateOrThrowError(linkNotesSchema, c);

	try {
		const linkInsert = toIds.map((id) => ({ fromId, toId: id }));
		const result = await db.insert(links).values(linkInsert).returning();
		return c.json(result);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});
