import { Hono } from "hono";
import type { Bindings } from "..";
import { zx } from "zodix";
import {
	LinkIntentSchema,
	OptionalEntitySchema,
	type SessionInsert,
	badRequest,
	createDrizzleForTurso,
	createSession,
	deleteSession,
	getUserSessions,
	handleAddLinkToSession,
	handleBulkSessionLinking,
	sessionInsertSchema,
	updateSession,
	notesInsertSchema,
	type NoteInsert,
	createNoteFromInsert,
	charactersInSessions,
	notesOnCharacters,
	notesOnSessions,
	handleRemoveLinkByIntent,
	deleteNotesFromSession,
	deleteFactionsFromSession,
	deleteCharactersFromSession,
} from "@repo/db";
import { uuidv4 } from "callum-util";
import { internalServerError } from "~/utils";
import { z } from "zod";
import { and } from "drizzle-orm/sql";
import { eq } from "drizzle-orm/expressions";

export const sessionsRoute = new Hono<{ Bindings: Bindings }>();

// This is private, eventually
sessionsRoute.get("/", async (c) => {
	const { userId } = c.req.query();
	if (!userId) {
		return badRequest("No user id query param provided");
	}
	const db = createDrizzleForTurso(c.env);
	const userSessions = await getUserSessions(db, userId);

	return c.json(userSessions);
});

sessionsRoute.post("/", async (c) => {
	const newSessionData = await zx.parseForm(
		c.req.raw,
		sessionInsertSchema.omit({ id: true }),
	);

	const db = createDrizzleForTurso(c.env);
	const sessionInsert: SessionInsert = {
		id: `sesh_${uuidv4()}`,
		...newSessionData,
	};

	// handle some more errors
	const newSession = await createSession(db, sessionInsert);

	return c.json(newSession);
});

sessionsRoute.patch("/:sessionId", async (c) => {
	const sessionId = c.req.param("sessionId");
	const db = createDrizzleForTurso(c.env);
	const sessionUpdateData = await zx.parseForm(
		c.req.raw,
		sessionInsertSchema.partial(),
	);
	const updatedSession = await updateSession(db, sessionUpdateData, sessionId);

	return c.json(updatedSession);
});

sessionsRoute.delete("/:sessionId", async (c) => {
	const sessionId = c.req.param("sessionId");
	const db = createDrizzleForTurso(c.env);
	const result = await deleteSession(db, sessionId);
	if (result.success) {
		return c.text("Session successfully deleted");
	}
	throw internalServerError();
});

sessionsRoute.post("/:sessionId/links", async (c) => {
	const sessionId = c.req.param("sessionId");
	const { intent, targetId } = await zx.parseForm(c.req.raw, {
		intent: LinkIntentSchema,
		targetId: z.string(),
	});
	const db = createDrizzleForTurso(c.env);
	return await handleAddLinkToSession(db, sessionId, targetId, intent);
});

sessionsRoute.put("/:sessionId/links", async (c) => {
	const sessionId = c.req.param("sessionId");
	const { intent, targetIds } = await zx.parseForm(c.req.raw, {
		intent: LinkIntentSchema,
		targetIds: OptionalEntitySchema,
	});

	const db = createDrizzleForTurso(c.env);
	return await handleBulkSessionLinking(db, sessionId, targetIds, intent);
});

sessionsRoute.delete("/:sessionId/links", async (c) => {
	const sessionId = c.req.param("sessionId");

	const { intent, linkIds } = await zx.parseForm(c.req.raw, {
		intent: LinkIntentSchema,
		linkIds: OptionalEntitySchema,
	});

	const db = createDrizzleForTurso(c.env);
	await handleRemoveLinkByIntent(db, sessionId, linkIds, intent, {
		notes: deleteNotesFromSession,
		factions: deleteFactionsFromSession,
		characters: deleteCharactersFromSession,
	});

	return c.text("The route has fired, and something has happened");
});

// Here, we are letting the user create a note as to why the character is linked to the
// session. As such, it makes sense to also link the note to both the session and the
// character.
sessionsRoute.post("/:sessionId/characters/:characterId", async (c) => {
	const { sessionId, characterId } = c.req.param();
	const newNoteData = await zx.parseForm(
		c.req.raw,
		notesInsertSchema.omit({ id: true }),
	);

	const noteInsert: NoteInsert = {
		id: `note_${uuidv4()}`,
		...newNoteData,
	};

	console.log(noteInsert);

	const db = createDrizzleForTurso(c.env);
	const newNote = await createNoteFromInsert(db, noteInsert);

	await db
		.update(charactersInSessions)
		.set({ noteId: newNote.id })
		.where(
			and(
				eq(charactersInSessions.characterId, characterId),
				eq(charactersInSessions.sessionId, sessionId),
			),
		);

	// Here we are going to create the links between note and character/session
	await db.insert(notesOnCharacters).values({
		characterId,
		noteId: newNote.id,
	});
	// This last one might be weird.. because the note will appear in the note feed on the
	// session view, which is probably a duplication of information
	await db.insert(notesOnSessions).values({
		sessionId,
		noteId: newNote.id,
	});

	return c.json(newNote);
});
