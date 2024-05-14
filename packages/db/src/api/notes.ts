import { uuidv4 } from "callum-util";
import { and, eq } from "drizzle-orm";
import { DB } from "../db";
import { charactersInFactions } from "../db/schemas/characters";
import {
	notes,
	notesOnCharacters,
	notesOnFactions,
	notesOnSessions,
	notesOnPlots,
	linkedNotes,
} from "../db/schemas/notes";
import { plotsOnCharacters, plotsOnFactions } from "../db/schemas/plots";
import {
	charactersInSessions,
	factionsInSessions,
	plotsInSessions,
} from "../db/schemas/sessions";
import { LinkedNoteInsert, MultiSelectString } from "../types";
import { LINK_INTENT, internalServerError, noContent } from "./util";
import { handleLinkingByIntent } from "./generic";

export const getAllNotesWithRelations = async (db: DB, userId: string) => {
	const allNotes = await db.query.notes.findMany({
		where: and(eq(notes.userId, userId), eq(notes.isLinkNote, false)),
		with: {
			characters: {
				with: {
					character: {
						columns: {
							id: true,
							name: true,
						},
					},
				},
			},
			factions: {
				with: {
					faction: {
						columns: {
							id: true,
							name: true,
						},
					},
				},
			},
			sessions: {
				with: {
					session: {
						columns: {
							id: true,
							name: true,
						},
					},
				},
			},
			plots: {
				with: {
					plot: {
						columns: {
							id: true,
							name: true,
						},
					},
				},
			},
		},
	});

	return allNotes;
};

export const getNote = async (db: DB, noteId: string) => {
	return await db.select().from(notes).where(eq(notes.id, noteId));
};

export const getNoteAndLinkedEntities = async (db: DB, noteId: string) => {
	const noteData = await db.query.notes.findFirst({
		where: eq(notes.id, noteId),
		with: {
			characters: {
				with: {
					character: true,
				},
			},
			factions: {
				with: {
					faction: true,
				},
			},
			plots: {
				with: {
					plot: true,
				},
			},
			sessions: {
				with: {
					session: true,
				},
			},
			folder: true,
		},
	});

	return noteData;
};

// POST
export const createNote = async (
	db: DB,
	userId: string,
	name: string,
	htmlContent: string | undefined,
	isLinkNote?: boolean,
) => {
	const newNoteId = `note_${uuidv4()}`;
	const newNote = await db
		.insert(notes)
		.values({
			id: newNoteId,
			name,
			htmlContent: htmlContent ?? "Start writing..",
			userId,
			isLinkNote,
		})
		.returning();
	return newNote[0];
};

// PUT
export const deleteCharacterJoinsFromNote = async (db: DB, noteId: string) => {
	return await db.delete(notesOnCharacters).where(eq(notesOnCharacters.noteId, noteId));
};
export const deleteFactionJoinsFromNote = async (db: DB, noteId: string) => {
	return await db.delete(notesOnFactions).where(eq(notesOnFactions.noteId, noteId));
};
export const deleteSessionJoinsFromNote = async (db: DB, noteId: string) => {
	return await db.delete(notesOnSessions).where(eq(notesOnSessions.noteId, noteId));
};
export const deletePlotJoinsFromNote = async (db: DB, noteId: string) => {
	return await db.delete(notesOnPlots).where(eq(notesOnPlots.noteId, noteId));
};
export const deleteNoteConnectionsFromNote = async (db: DB, noteId: string) => {
	return await db
		.delete(linkedNotes)
		.where(and(eq(linkedNotes.from, noteId), eq(linkedNotes.to, noteId)));
};

export const linkSessionsToNote = async (
	db: DB,
	noteId: string,
	sessionIds: string[],
) => {
	const insert = sessionIds.map((id) => ({
		noteId: noteId,
		sessionId: id,
	}));
	return await db
		.insert(notesOnSessions)
		.values(insert)
		.onConflictDoNothing()
		.returning();
};

export const linkCharactersToNote = async (
	db: DB,
	noteId: string,
	characterIds: string[],
) => {
	const insert = characterIds.map((id) => ({
		noteId: noteId,
		characterId: id,
	}));
	return await db
		.insert(notesOnCharacters)
		.values(insert)
		.onConflictDoNothing()
		.returning();
};

export const linkFactionsToNote = async (
	db: DB,
	noteId: string,
	factionIds: string[],
) => {
	const insert = factionIds.map((id) => ({
		noteId: noteId,
		factionId: id,
	}));
	return await db
		.insert(notesOnFactions)
		.values(insert)
		.onConflictDoNothing()
		.returning();
};

export const linkPlotsToNote = async (db: DB, noteId: string, plotIds: string[]) => {
	const insert = plotIds.map((id) => ({
		noteId: noteId,
		plotId: id,
	}));
	return await db.insert(notesOnPlots).values(insert).onConflictDoNothing().returning();
};

export const linkNotesTogether = async (
	db: DB,
	noteId: string,
	targetNoteIds: string[],
) => {
	const insert: LinkedNoteInsert[] = [];
	targetNoteIds.forEach((id) => {
		insert.push({
			from: noteId,
			to: id,
		});
		insert.push({
			from: id,
			to: noteId,
		});
	});

	return await db.insert(linkedNotes).values(insert).returning().onConflictDoNothing();
};

///
/// NOTES ON JOIN TABLES
///
type LinkIds = {
	fromId: string;
	toId: string;
};
// TODO: This api is terrible.
export const createNoteForSeshCharJoin = async (
	db: DB,
	userId: string,
	linkIds: LinkIds,
	name?: string,
	htmlContent?: string,
) => {
	const newNote = await createNote(db, userId, name ?? "LINK-NOTE", htmlContent, true);
	await db
		.update(charactersInSessions)
		.set({ noteId: newNote.id })
		.where(
			and(
				eq(charactersInSessions.sessionId, linkIds.fromId),
				eq(charactersInSessions.characterId, linkIds.toId),
			),
		);
};
export const createNoteForSeshFactionJoin = async (
	db: DB,
	userId: string,
	linkIds: LinkIds,
	name?: string,
	htmlContent?: string,
) => {
	const newNote = await createNote(db, userId, name ?? "LINK-NOTE", htmlContent, true);
	await db
		.update(factionsInSessions)
		.set({ noteId: newNote.id })
		.where(
			and(
				eq(factionsInSessions.sessionId, linkIds.fromId),
				eq(factionsInSessions.factionId, linkIds.toId),
			),
		);
};
export const createNoteForSeshPlotJoin = async (
	db: DB,
	userId: string,
	linkIds: LinkIds,
	name?: string,
	htmlContent?: string,
) => {
	const newNote = await createNote(db, userId, name ?? "LINK-NOTE", htmlContent, true);
	await db
		.update(plotsInSessions)
		.set({ noteId: newNote.id })
		.where(
			and(
				eq(plotsInSessions.sessionId, linkIds.fromId),
				eq(plotsInSessions.plotId, linkIds.toId),
			),
		);
};
export const createNoteForCharFactionJoin = async (
	db: DB,
	userId: string,
	linkIds: LinkIds,
	name?: string,
	htmlContent?: string,
) => {
	const newNote = await createNote(db, userId, name ?? "LINK-NOTE", htmlContent, true);
	await db
		.update(charactersInFactions)
		.set({ noteId: newNote.id })
		.where(
			and(
				eq(charactersInFactions.characterId, linkIds.fromId),
				eq(charactersInFactions.factionId, linkIds.toId),
			),
		);
};
export const createNoteForCharPlotJoin = async (
	db: DB,
	userId: string,
	linkIds: LinkIds,
	name?: string,
	htmlContent?: string,
) => {
	const newNote = await createNote(db, userId, name ?? "LINK-NOTE", htmlContent, true);
	await db
		.update(plotsOnCharacters)
		.set({ noteId: newNote.id })
		.where(
			and(
				eq(plotsOnCharacters.characterId, linkIds.fromId),
				eq(plotsOnCharacters.plotId, linkIds.toId),
			),
		);
};
export const createNoteforFactionPlotJoin = async (
	db: DB,
	userId: string,
	linkIds: LinkIds,
	name?: string,
	htmlContent?: string,
) => {
	const newNote = await createNote(db, userId, name ?? "LINK-NOTE", htmlContent, true);
	await db
		.update(plotsOnFactions)
		.set({ noteId: newNote.id })
		.where(
			and(
				eq(plotsOnFactions.factionId, linkIds.fromId),
				eq(plotsOnFactions.plotId, linkIds.toId),
			),
		);
};

// export const handleLinkCharactersToNote = async (
// 	db: DB,
// 	input: string | string[] | undefined,
// 	noteId: string,
// ) => {
// 	const charactersToLink = validateOptionalArrayOrString(input);
//
// 	if (charactersToLink.length > 0) {
// 		await linkCharactersToNote(db, noteId, charactersToLink);
// 	}
// };
// export const handleLinkFactionsToNote = async (
// 	db: DB,
// 	input: string | string[] | undefined,
// 	noteId: string,
// ) => {
// 	const factionsToLink = validateOptionalArrayOrString(input);
//
// 	if (factionsToLink.length > 0) {
// 		await linkFactionsToNote(db, noteId, factionsToLink);
// 	}
//
// 	return factionsToLink;
// };
// export const handleLinkSessionsToNote = async (
// 	db: DB,
// 	input: string | string[] | undefined,
// 	noteId: string,
// ) => {
// 	const sessionsToLink = validateOptionalArrayOrString(input);
//
// 	if (sessionsToLink.length > 0) {
// 		await linkSessionsToNote(db, noteId, sessionsToLink);
// 	}
//
// 	return sessionsToLink;
// };

/**
 * Throws an error if any of the delete actions fail.
 */
export const deleteNoteJoins = async (db: DB, noteId: string) => {
	const deleteCharJoin = db
		.delete(notesOnCharacters)
		.where(eq(notesOnCharacters.noteId, noteId));
	const deleteFactionJoin = db
		.delete(notesOnFactions)
		.where(eq(notesOnFactions.noteId, noteId));
	const deleteSessionJoin = db
		.delete(notesOnSessions)
		.where(eq(notesOnSessions.noteId, noteId));
	const deletePlotJoin = db.delete(notesOnPlots).where(eq(notesOnPlots.noteId, noteId));

	try {
		await Promise.all([
			deleteCharJoin,
			deleteFactionJoin,
			deleteSessionJoin,
			deletePlotJoin,
		]);
	} catch (err) {
		console.error(err);
		throw new Error("Failed to delete all joins");
	}
};

export const updateNoteContent = async (db: DB, noteId: string, htmlContent: string) => {
	return await db
		.update(notes)
		.set({
			htmlContent,
		})
		.where(eq(notes.id, noteId))
		.returning();
};

export const updateNoteName = async (db: DB, noteId: string, name: string) => {
	return await db
		.update(notes)
		.set({
			name,
		})
		.where(eq(notes.id, noteId))
		.returning();
};

export const handleDeleteNote = async (db: DB, noteId: string) => {
	// TODO: This try catch has a number of problems:
	// Not in parallel
	// Do not have a process for completing the process.
	// We will be left with bad data in the database if it fails halfway through
	try {
		await db.delete(notes).where(eq(notes.id, noteId));
		await db.delete(notesOnFactions).where(eq(notesOnFactions.noteId, noteId));
		await db.delete(notesOnCharacters).where(eq(notesOnCharacters.noteId, noteId));
		await db.delete(notesOnSessions).where(eq(notesOnSessions.noteId, noteId));
		return noContent();
	} catch (err) {
		console.error(err);
		return internalServerError();
	}
};

// Handle note linking
export const handleBulkNoteLinking = async (
	db: DB,
	noteId: string,
	targetIds: MultiSelectString,
	intent: LINK_INTENT,
) => {
	return await handleLinkingByIntent(db, noteId, targetIds, intent, {
		characters: {
			link: linkCharactersToNote,
			delete: deleteCharacterJoinsFromNote,
		},
		factions: {
			link: linkFactionsToNote,
			delete: deleteFactionJoinsFromNote,
		},
		notes: {
			link: linkNotesTogether,
			delete: deleteNoteConnectionsFromNote,
		},
		plots: {
			link: linkPlotsToNote,
			delete: deletePlotJoinsFromNote,
		},
		sessions: {
			link: linkSessionsToNote,
			delete: deleteSessionJoinsFromNote,
		},
	});
};
