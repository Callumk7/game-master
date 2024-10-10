import {
	createNoteSchema,
	duplicateNoteSchema,
	linkCharactersSchema,
	linkFactionsSchema,
	linkNotesSchema,
	updateNoteContentSchema,
	type Id,
	type Note,
	type NoteWithPermissions,
} from "@repo/api";
import { Hono } from "hono";
import { db } from "~/db";
import { links, notes, notesPermissions } from "~/db/schema/notes";
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
import { notesOnCharacters } from "~/db/schema/characters";
import { notesOnFactions } from "~/db/schema/factions";
import { usersToGames } from "~/db/schema/games";

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

	let newNote: Note;
	try {
		const result = await db
			.insert(notes)
			.values(newNoteInsert)
			.returning()
			.then((result) => result[0]);

		if (!result) {
			return handleDatabaseError(c);
		}

		newNote = result;
	} catch (error) {
		return handleDatabaseError(c, error);
	}

	const memberList = await db.query.usersToGames
		.findMany({
			where: eq(usersToGames.gameId, newNote.gameId),
			columns: { userId: true },
		})
		.then((result) => result.map((row) => row.userId));

	const permissionsInsert = [];
	for (const memberId of memberList) {
		if (memberId !== newNote.ownerId) {
			if (newNote.visibility === "private") {
				permissionsInsert.push({
					noteId: newNote.id,
					userId: memberId,
					canView: false,
					canEdit: false,
				});
			}

			if (newNote.visibility === "viewable") {
				permissionsInsert.push({
					noteId: newNote.id,
					userId: memberId,
					canView: true,
					canEdit: false,
				});
			}

			if (newNote.visibility === "public") {
				permissionsInsert.push({
					noteId: newNote.id,
					userId: memberId,
					canView: true,
					canEdit: true,
				});
			}
		}
	}

	// owner permissions
	permissionsInsert.push({
		noteId: newNote.id,
		userId: newNote.ownerId,
		canView: true,
		canEdit: true,
	});

	try {
		await db.insert(notesPermissions).values(permissionsInsert);
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
				...note,
				id: generateNoteId(),
				name: data.name,
				createdAt: currentDate,
				updatedAt: currentDate,
			})
			.returning()
			.then((result) => result[0]);
		return successResponse(c, newNote);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

notesRoute.get("/:noteId/permissions", async (c) => {
	const noteId = c.req.param("noteId");
	try {
		const result: NoteWithPermissions | undefined = await db.query.notes.findFirst({
			where: eq(notes.id, noteId),
			with: {
				permissions: {
					columns: {
						userId: true,
						canView: true,
						canEdit: true,
					},
				},
			},
		});

		if (!result) {
			return handleNotFound(c);
		}
		return c.json(result);
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

notesRoute.get("/:noteId/links/characters", async (c) => {
	const noteId = c.req.param("noteId");

	try {
		const linkedChars = await db.query.notesOnCharacters
			.findMany({
				where: eq(notesOnCharacters.noteId, noteId),
				with: {
					character: true,
				},
			})
			.then((result) => result.map((row) => row.character));
		return c.json(linkedChars);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

notesRoute.post("/:noteId/links/characters", async (c) => {
	const noteId = c.req.param("noteId");
	const { characterIds } = await validateOrThrowError(linkCharactersSchema, c);

	try {
		const linkInsert = characterIds.map((id) => ({ noteId, characterId: id }));
		const result = await db
			.insert(notesOnCharacters)
			.values(linkInsert)
			.returning()
			.onConflictDoNothing();
		return c.json(result);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

notesRoute.get("/:noteId/links/factions", async (c) => {
	const noteId = c.req.param("noteId");

	try {
		const linkedFactions = await db.query.notesOnFactions
			.findMany({
				where: eq(notesOnFactions.noteId, noteId),
				with: {
					faction: true,
				},
			})
			.then((result) => result.map((row) => row.faction));
		return c.json(linkedFactions);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

notesRoute.post("/:noteId/links/factions", async (c) => {
	const noteId = c.req.param("noteId");
	const { factionIds } = await validateOrThrowError(linkFactionsSchema, c);

	try {
		const linkInsert = factionIds.map((id) => ({ noteId, factionId: id }));
		const result = await db
			.insert(notesOnFactions)
			.values(linkInsert)
			.returning()
			.onConflictDoNothing();
		return c.json(result);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

// Replace all links
notesRoute.put("/:noteId/links/characters", async (c) => {
	const noteId = c.req.param("noteId");
	const { characterIds } = await validateOrThrowError(linkCharactersSchema, c);

	console.log(characterIds);

	try {
		const linkInsert = characterIds.map((id) => ({ noteId, characterId: id }));
		await db.delete(notesOnCharacters).where(eq(notesOnCharacters.noteId, noteId));
		const result = await db
			.insert(notesOnCharacters)
			.values(linkInsert)
			.returning()
			.onConflictDoNothing();
		return c.json(result);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

// Replace all links
notesRoute.put("/:noteId/links/factions", async (c) => {
	const noteId = c.req.param("noteId");
	const { factionIds } = await validateOrThrowError(linkFactionsSchema, c);

	try {
		const linkInsert = factionIds.map((id) => ({ noteId, factionId: id }));
		await db.delete(notesOnFactions).where(eq(notesOnFactions.noteId, noteId));
		const result = await db
			.insert(notesOnFactions)
			.values(linkInsert)
			.returning()
			.onConflictDoNothing();
		return c.json(result);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});
