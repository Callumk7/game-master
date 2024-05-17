import { eq, and, inArray } from "drizzle-orm";
import { DB } from "../db";
import { charactersInFactions } from "../db/schemas/characters";
import { factions } from "../db/schemas/factions";
import { notesOnFactions } from "../db/schemas/notes";
import { plotsOnFactions } from "../db/schemas/plots";
import { factionsInSessions } from "../db/schemas/sessions";
import type { Faction, FactionInsert, MultiSelectString } from "../types";
import { LINK_INTENT } from "./util";
import { handleLinkingByIntent } from "./generic";

///
/// GET DATA
///
export const getAllUserFactions = async (db: DB, userId: string) => {
	return await db.select().from(factions).where(eq(factions.userId, userId));
};

export const getFaction = async (db: DB, factionId: string) => {
	return await db.query.factions.findFirst({
		where: eq(factions.id, factionId),
		with: {
			members: {
				with: {
					character: true,
				},
			},
			leader: true,
			notes: {
				with: {
					note: true,
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
		},
	});
};

export const createFaction = async (db: DB, factionInsert: FactionInsert) => {
	const newFaction = await db.insert(factions).values(factionInsert).returning();
	return newFaction[0];
};

///
/// UPDATE DATA
///
export const updateFaction = async (
	db: DB,
	update: Partial<Faction>,
	factionId: string,
) => {
	const result = await db
		.update(factions)
		.set(update)
		.where(eq(factions.id, factionId))
		.returning();
	return result[0];
};

export const deleteSessionJoinsFromFaction = async (db: DB, factionId: string) => {
	return await db
		.delete(factionsInSessions)
		.where(eq(factionsInSessions.factionId, factionId));
};
export const deleteNoteJoinsFromFaction = async (db: DB, factionId: string) => {
	return await db
		.delete(notesOnFactions)
		.where(eq(notesOnFactions.factionId, factionId));
};
export const deleteCharacterJoinsOnFaction = async (db: DB, factionId: string) => {
	return await db
		.delete(charactersInFactions)
		.where(eq(charactersInFactions.factionId, factionId));
};
export const deletePlotJoinsFromFaction = async (db: DB, factionId: string) => {
	return await db
		.delete(plotsOnFactions)
		.where(eq(plotsOnFactions.factionId, factionId));
};

export const linkNotesToFaction = async (
	db: DB,
	factionId: string,
	noteIds: string[],
) => {
	const insert = noteIds.map((id) => ({
		factionId,
		noteId: id,
	}));
	return await db
		.insert(notesOnFactions)
		.values(insert)
		.onConflictDoNothing()
		.returning();
};
export const linkCharactersToFaction = async (
	db: DB,
	factionId: string,
	characterIds: string[],
) => {
	const insert = characterIds.map((id) => ({
		factionId,
		characterId: id,
	}));
	return await db
		.insert(charactersInFactions)
		.values(insert)
		.onConflictDoNothing()
		.returning();
};
export const linkPlotsToFaction = async (
	db: DB,
	factionId: string,
	plotIds: string[],
) => {
	const insert = plotIds.map((id) => ({
		factionId,
		plotId: id,
	}));
	return await db
		.insert(plotsOnFactions)
		.values(insert)
		.onConflictDoNothing()
		.returning();
};
export const linkSessionsToFaction = async (
	db: DB,
	factionId: string,
	sessionIds: string[],
) => {
	const insert = sessionIds.map((id) => ({
		factionId,
		sessionId: id,
	}));
	return await db
		.insert(factionsInSessions)
		.values(insert)
		.onConflictDoNothing()
		.returning();
};

// Delete specific connections
export const deleteNotesFromFaction = async (
	db: DB,
	factionId: string,
	noteIds: string[],
) => {
	await db
		.delete(notesOnFactions)
		.where(
			and(
				eq(notesOnFactions.factionId, factionId),
				inArray(notesOnFactions.noteId, noteIds),
			),
		);
};
export const deleteCharactersFromFaction = async (
	db: DB,
	factionId: string,
	characterIds: string[],
) => {
	await db
		.delete(charactersInFactions)
		.where(
			and(
				eq(charactersInFactions.factionId, factionId),
				inArray(charactersInFactions.characterId, characterIds),
			),
		);
};
export const deletePlotsFromFaction = async (
	db: DB,
	factionId: string,
	plotIds: string[],
) => {
	await db
		.delete(plotsOnFactions)
		.where(
			and(
				eq(plotsOnFactions.factionId, factionId),
				inArray(plotsOnFactions.plotId, plotIds),
			),
		);
};
export const deleteSessionsFromFaction = async (
	db: DB,
	factionId: string,
	sessionIds: string[],
) => {
	await db
		.delete(factionsInSessions)
		.where(
			and(
				eq(factionsInSessions.factionId, factionId),
				inArray(factionsInSessions.sessionId, sessionIds),
			),
		);
};

///
/// Complete Update Functions
///
export const handleFactionLinking = async (
	db: DB,
	factionId: string,
	targetIds: MultiSelectString,
	intent: LINK_INTENT,
) => {
	return await handleLinkingByIntent(db, factionId, targetIds, intent, {
		characters: {
			link: linkCharactersToFaction,
			delete: deleteCharacterJoinsOnFaction,
		},
		sessions: {
			link: linkSessionsToFaction,
			delete: deleteSessionJoinsFromFaction,
		},
		notes: {
			link: linkNotesToFaction,
			delete: deleteNoteJoinsFromFaction,
		},
		plots: {
			link: linkPlotsToFaction,
			delete: deletePlotJoinsFromFaction,
		},
	});
};
