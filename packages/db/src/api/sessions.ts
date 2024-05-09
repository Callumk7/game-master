import { eq } from "drizzle-orm";
import { DB } from "../db";
import { notesOnSessions } from "../db/schemas/notes";
import {
	sessions,
	charactersInSessions,
	factionsInSessions,
	plotsInSessions,
} from "../db/schemas/sessions";
import { CompleteNote, Session } from "../types";

export const getCompleteSession = async (db: DB, sessionId: string) => {
	const session = await db.query.sessions.findFirst({
		where: eq(sessions.id, sessionId),
		with: {
			characters: {
				with: { character: true, note: true },
			},
			factions: {
				with: { faction: { with: { leader: true } }, note: true },
			},
			plots: {
				with: { plot: true, note: true },
			},
			notes: {
				with: {
					note: {
						with: {
							characters: {
								with: { character: true },
							},
							factions: {
								with: { faction: true },
							},
							sessions: {
								with: { session: true },
							},
							plots: {
								with: {
									plot: true,
								},
							},
						},
					},
				},
			},
		},
	});

	return session;
};

export const getSessionNotes = async (db: DB, sessionId: string) => {
	const session = await db.query.sessions.findFirst({
		where: eq(sessions.id, sessionId),
		with: {
			notes: {
				with: {
					note: {
						with: {
							characters: {
								with: { character: true },
							},
							factions: {
								with: { faction: true },
							},
							sessions: {
								with: { session: true },
							},
							plots: {
								with: { plot: true },
							},
						},
					},
				},
			},
		},
	});

	if (!session) {
		return [];
	}

	const sessionNotes: CompleteNote[] = session.notes.map((n) => ({
		...n.note,
		characters: n.note.characters.map((c) => c.character),
		factions: n.note.factions.map((f) => f.faction),
		sessions: n.note.sessions.map((s) => s.session),
		plots: n.note.plots.map((p) => p.plot),
	}));

	return sessionNotes;
};

// PUT

/**
 * Throws an error if any of the delete actions fail.
 */
export const deleteSessionJoins = async (db: DB, sessionId: string) => {
	const deleteCharJoin = db
		.delete(charactersInSessions)
		.where(eq(charactersInSessions.sessionId, sessionId));
	const deleteFactionJoin = db
		.delete(factionsInSessions)
		.where(eq(factionsInSessions.sessionId, sessionId));
	const deleteNoteJoin = db
		.delete(notesOnSessions)
		.where(eq(notesOnSessions.sessionId, sessionId));
	const deletePlotJoin = db
		.delete(plotsInSessions)
		.where(eq(plotsInSessions.sessionId, sessionId));

	try {
		await Promise.all([
			deleteCharJoin,
			deleteFactionJoin,
			deleteNoteJoin,
			deletePlotJoin,
		]);
	} catch (err) {
		console.error(err);
		throw new Error("Failed to delete all joins");
	}
};

export const deleteCharacterJoinsFromSession = async (db: DB, sessionId: string) => {
	return await db
		.delete(charactersInSessions)
		.where(eq(charactersInSessions.sessionId, sessionId));
};
export const deleteFactionJoinsFromSession = async (db: DB, sessionId: string) => {
	return await db
		.delete(factionsInSessions)
		.where(eq(factionsInSessions.sessionId, sessionId));
};
export const deleteNoteJoinsFromSession = async (db: DB, sessionId: string) => {
	return await db
		.delete(notesOnSessions)
		.where(eq(notesOnSessions.sessionId, sessionId));
};
export const deletePlotJoinsOnSession = async (db: DB, sessionId: string) => {
	return await db
		.delete(plotsInSessions)
		.where(eq(plotsInSessions.sessionId, sessionId));
};

export const linkNotesToSession = async (
	db: DB,
	sessionId: string,
	noteIds: string[],
) => {
	const insert = noteIds.map((id) => ({
		sessionId: sessionId,
		noteId: id,
	}));
	return await db
		.insert(notesOnSessions)
		.values(insert)
		.onConflictDoNothing()
		.returning();
};

export const linkCharactersToSession = async (
	db: DB,
	sessionId: string,
	characterIds: string[],
) => {
	const insert = characterIds.map((id) => ({
		sessionId: sessionId,
		characterId: id,
	}));
	return await db
		.insert(charactersInSessions)
		.values(insert)
		.onConflictDoNothing()
		.returning();
};

export const linkFactionsToSession = async (
	db: DB,
	sessionId: string,
	factionIds: string[],
) => {
	const insert = factionIds.map((id) => ({
		sessionId: sessionId,
		factionId: id,
	}));
	return await db
		.insert(factionsInSessions)
		.values(insert)
		.onConflictDoNothing()
		.returning();
};

export const linkPlotsToSession = async (
	db: DB,
	sessionId: string,
	plotIds: string[],
) => {
	const insert = plotIds.map((id) => ({
		sessionId: sessionId,
		plotId: id,
	}));
	return await db
		.insert(plotsInSessions)
		.values(insert)
		.onConflictDoNothing()
		.returning();
};

// Update session
export const updateSession = async (
	db: DB,
	update: Partial<Session>,
	sessionId: string,
): Promise<Session> => {
	const result = await db
		.update(sessions)
		.set(update)
		.where(eq(sessions.id, sessionId))
		.returning();
	return result[0];
};