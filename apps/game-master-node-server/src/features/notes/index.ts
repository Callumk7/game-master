import {
	createNoteSchema,
	createPermissionSchema,
	duplicateNoteSchema,
	linkCharactersSchema,
	linkFactionsSchema,
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
import { notesOnCharacters } from "~/db/schema/characters";
import { notesOnFactions } from "~/db/schema/factions";
import {
	createNote,
	createNotePermission,
	getNoteWithPermissions,
	updateNote,
} from "./queries";
import { validateUploadIsImageOrThrow } from "~/utils";
import { s3 } from "~/lib/s3";
import { images } from "~/db/schema/images";
import { getPayload } from "~/lib/jwt";
import { PermissionService } from "~/services/permissions";

export const notesRoute = new Hono();

const getNote = async (noteId: Id) => {
	return await db.query.notes.findFirst({
		where: eq(notes.id, noteId),
	});
};

notesRoute.post("/", async (c) => {
	const data = await validateOrThrowError(createNoteSchema, c);
	const newNoteInsert = createNoteInsert(data);
	try {
		const newNote = await createNote(newNoteInsert);
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
		const noteUpdate = await updateNote(noteId, data);
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
	const { userId } = getPayload(c);
	try {
		const noteResult = await getNoteWithPermissions(noteId);
		const noteWithPermission = PermissionService.appendPermissionLevel(
			noteResult,
			userId,
		);
		return c.json(noteWithPermission);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});

notesRoute.post("/:noteId/permissions", async (c) => {
	const noteId = c.req.param("noteId");
	const data = await validateOrThrowError(createPermissionSchema, c);
	try {
		const newPermission = await createNotePermission(
			data.userId,
			noteId,
			data.permission,
		);
		return successResponse(c, newPermission);
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
	const { noteIds } = await validateOrThrowError(linkNotesSchema, c);

	try {
		const linkInsert = noteIds.map((id) => ({ fromId, toId: id }));
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
		return c.json(result); // TODO: should be success response
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

////////////////////////////////////////////////////////////////////////////////
//                                Images
////////////////////////////////////////////////////////////////////////////////

notesRoute.post("/:noteId/images", async (c) => {
	const noteId = c.req.param("noteId");

	const { ownerId, image } = await validateUploadIsImageOrThrow(c.req);
	let imageUrl: string;
	let imageId: string;
	try {
		const result = await s3.upload(image, { ownerId, entityId: noteId });
		imageUrl = result.imageUrl;
		imageId = result.imageId;
	} catch (error) {
		console.error(error);
		return handleDatabaseError(c, "The error was caught in the images route");
	}

	try {
		const imageResult = await db
			.insert(images)
			.values({ id: imageId, ownerId, noteId, imageUrl })
			.returning()
			.then((result) => result[0]);

		if (!imageResult) {
			return handleDatabaseError(c, "image result not returned from database");
		}

		return successResponse(c, imageResult);
	} catch (error) {
		return handleDatabaseError(c, error);
	}
});
