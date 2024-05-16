import { eq, and, inArray } from "drizzle-orm";
import { DB } from "../db";
import {
	characters,
	charactersInFactions,
	allies,
	enemies,
} from "../db/schemas/characters";
import { notesOnCharacters, notes } from "../db/schemas/notes";
import { plotsOnCharacters } from "../db/schemas/plots";
import { charactersInSessions } from "../db/schemas/sessions";
import {
	AllyInsert,
	Character,
	CharactersInFactionsInsert,
	EnemyInsert,
	MultiSelectString,
	NoteInsert,
} from "../types";
import { LINK_INTENT } from "./util";
import { handleAddLinkToTargetByIntent, handleLinkingByIntent } from "./generic";
import { linkFactionsToNote } from "./notes";

export const getFullCharacterData = async (db: DB, characterId: string) => {
	const charResult = await db.query.characters.findFirst({
		where: eq(characters.id, characterId),
		with: {
			race: true,
			notes: {
				with: {
					note: {
						with: {
							characters: {
								with: { character: true },
							},
						},
					},
				},
			},
			plots: {
				with: {
					plot: true,
					note: true,
				},
			},
			sessions: {
				with: {
					session: true,
				},
			},
			factions: {
				with: {
					faction: true,
					note: true,
				},
			},
			enemies: {
				with: {
					enemy: {
						columns: {
							id: true,
							name: true,
						},
					},
					note: true,
				},
			},
			allies: {
				with: {
					ally: {
						columns: {
							id: true,
							name: true,
						},
					},
					note: true,
				},
			},
		},
	});

	return charResult;
};

export const getAllUserCharacters = async (db: DB, userId: string) => {
	const allCharacters = await db.query.characters.findMany({
		where: eq(characters.userId, userId),
		with: {
			race: true,
			factions: {
				with: {
					faction: true,
				},
			},
		},
	});

	return allCharacters;
};

///
/// DELETE LINKS FROM CHARACTER
///
export const deleteSessionJoinsFromChar = async (db: DB, characterId: string) => {
	return await db
		.delete(charactersInSessions)
		.where(eq(charactersInSessions.characterId, characterId));
};
export const deleteFactionJoinsFromChar = async (db: DB, characterId: string) => {
	return await db
		.delete(charactersInFactions)
		.where(eq(charactersInFactions.characterId, characterId));
};
export const deleteNoteJoinsFromChar = async (db: DB, characterId: string) => {
	return await db
		.delete(notesOnCharacters)
		.where(eq(notesOnCharacters.characterId, characterId));
};
export const deletePlotJoinsFromChar = async (db: DB, characterId: string) => {
	return await db
		.delete(plotsOnCharacters)
		.where(eq(plotsOnCharacters.characterId, characterId));
};
export const deleteAllyJoinsFromChar = async (db: DB, characterId: string) => {
	return await db.delete(allies).where(eq(allies.characterId, characterId));
};
export const deleteEnemyJoinsFromChar = async (db: DB, characterId: string) => {
	return await db.delete(enemies).where(eq(enemies.characterId, characterId));
};
export const deleteAllCharacterJoins = async (db: DB, characterId: string) => {
	const deleteSessionJoin = deleteSessionJoinsFromChar(db, characterId);
	const deleteFactionJoin = deleteFactionJoinsFromChar(db, characterId);
	const deleteNoteJoin = deleteNoteJoinsFromChar(db, characterId);
	const deletePlotJoin = deletePlotJoinsFromChar(db, characterId);

	try {
		await Promise.all([
			deleteSessionJoin,
			deleteFactionJoin,
			deleteNoteJoin,
			deletePlotJoin,
		]);
	} catch (err) {
		console.error(err);
		throw new Error("Failed to delete all joins");
	}
};

///
/// LINK ENTITIES TO CHARAACTER
///
export const linkNotesToCharacter = async (
	db: DB,
	characterId: string,
	noteIds: string[],
) => {
	const insert = noteIds.map((id) => ({
		characterId: characterId,
		noteId: id,
	}));
	return await db
		.insert(notesOnCharacters)
		.values(insert)
		.onConflictDoNothing()
		.returning();
};
export const linkFactionsToCharacter = async (
	db: DB,
	characterId: string,
	factionIds: string[],
) => {
	const linkInsert: CharactersInFactionsInsert[] = [];
	const noteInsert: NoteInsert[] = [];
	for (const id of factionIds) {
		const noteId = `link_${characterId}_${id}`;
		linkInsert.push({ characterId, factionId: id, noteId });
		noteInsert.push({
			id: noteId,
			name: "LINK NOTE",
			userId: "NO_USER",
			htmlContent: "Default Note",
		});
	}
	// const insert = factionIds.map((id) => ({
	// 	characterId: characterId,
	// 	factionId: id,
	// }));

	// await db.insert(notes).values(noteInsert).onConflictDoNothing();
	return await db
		.insert(charactersInFactions)
		.values(linkInsert)
		.onConflictDoNothing()
		.returning();
};
export const linkPlotsToCharacter = async (
	db: DB,
	characterId: string,
	plotIds: string[],
) => {
	const insert = plotIds.map((id) => ({
		characterId: characterId,
		plotId: id,
	}));
	return await db
		.insert(plotsOnCharacters)
		.values(insert)
		.onConflictDoNothing()
		.returning();
};
export const linkSessionsToCharacter = async (
	db: DB,
	characterId: string,
	sessionIds: string[],
) => {
	const insert = sessionIds.map((id) => ({
		characterId: characterId,
		sessionId: id,
	}));
	return await db
		.insert(charactersInSessions)
		.values(insert)
		.onConflictDoNothing()
		.returning();
};
export const linkAlliesToChar = async (
	db: DB,
	characterId: string,
	allyIds: string[],
) => {
	const linkInsert: AllyInsert[] = [];
	const noteInsert: NoteInsert[] = [];
	for (const id of allyIds) {
		const noteId = `link_${characterId}_${id}`;
		linkInsert.push({ characterId, allyId: id, noteId });
		noteInsert.push({
			id: noteId,
			name: "LINK NOTE",
			userId: "NO_USER",
			htmlContent: "Default Note",
		});
	}
	// const insert = allyIds.map((id) => ({
	// 	characterId: characterId,
	// 	allyId: id,
	// }));
	await db.insert(notes).values(noteInsert).onConflictDoNothing();
	return await db.insert(allies).values(linkInsert).onConflictDoNothing().returning();
};
export const linkEnemiesToChar = async (
	db: DB,
	characterId: string,
	enemyIds: string[],
) => {
	const linkInsert: EnemyInsert[] = [];
	const noteInsert: NoteInsert[] = [];
	for (const id of enemyIds) {
		const noteId = `link_${characterId}_${id}`;
		linkInsert.push({ characterId, enemyId: id, noteId });
		noteInsert.push({
			id: noteId,
			name: "LINK NOTE",
			userId: "NO_USER",
			htmlContent: "Default Note",
		});
	}
	// const insert = enemyIds.map((id) => ({
	// 	characterId: characterId,
	// 	enemyId: id,
	// }));
	await db.insert(notes).values(noteInsert).onConflictDoNothing();
	return await db.insert(enemies).values(linkInsert).onConflictDoNothing().returning();
};

///
/// REMOVE SPECIFIC ENTITIES FROM CHARACTER
///
export const deleteNotesFromCharacter = async (
	db: DB,
	characterId: string,
	noteIds: string[],
) => {
	await db
		.delete(notesOnCharacters)
		.where(
			and(
				eq(notesOnCharacters.characterId, characterId),
				inArray(notesOnCharacters.noteId, noteIds),
			),
		);
};
export const deletePlotsFromCharacter = async (
	db: DB,
	characterId: string,
	plotIds: string[],
) => {
	await db
		.delete(plotsOnCharacters)
		.where(
			and(
				eq(plotsOnCharacters.characterId, characterId),
				inArray(plotsOnCharacters.plotId, plotIds),
			),
		);
};
export const deleteSessionsFromCharacter = async (
	db: DB,
	characterId: string,
	sessionIds: string[],
) => {
	await db
		.delete(charactersInSessions)
		.where(
			and(
				eq(charactersInSessions.characterId, characterId),
				inArray(charactersInSessions.sessionId, sessionIds),
			),
		);
};
export const deleteFactionsFromCharacter = async (
	db: DB,
	characterId: string,
	factionIds: string[],
) => {
	await db
		.delete(charactersInFactions)
		.where(
			and(
				eq(charactersInFactions.characterId, characterId),
				inArray(charactersInFactions.factionId, factionIds),
			),
		);
};

///
/// UPDATE CHARACTER DATA
///
export const updateCharacter = async (
	db: DB,
	update: Partial<Character>,
	characterId: string,
) => {
	const result = await db
		.update(characters)
		.set(update)
		.where(eq(characters.id, characterId))
		.returning();
	return result[0];
};

///
/// Complete Update Functions
///
export const handleBulkCharacterLinking = async (
	db: DB,
	characterId: string,
	targetIds: MultiSelectString,
	intent: LINK_INTENT,
) => {
	return await handleLinkingByIntent(db, characterId, targetIds, intent, {
		allies: {
			link: linkAlliesToChar,
			delete: deleteAllyJoinsFromChar,
		},
		enemies: {
			link: linkEnemiesToChar,
			delete: deleteEnemyJoinsFromChar,
		},
		factions: {
			link: linkFactionsToCharacter,
			delete: deleteFactionJoinsFromChar,
		},
		sessions: {
			link: linkSessionsToCharacter,
			delete: deleteSessionJoinsFromChar,
		},
		notes: {
			link: linkNotesToCharacter,
			delete: deleteNoteJoinsFromChar,
		},
		plots: {
			link: linkPlotsToCharacter,
			delete: deletePlotJoinsFromChar,
		},
	});
};

export const handleAddLinkToCharacter = async (
	db: DB,
	characterId: string,
	targetId: string,
	intent: LINK_INTENT,
) => {
	return await handleAddLinkToTargetByIntent(db, characterId, targetId, intent, {
		allies: linkAlliesToChar,
		enemies: linkEnemiesToChar,
		factions: linkFactionsToCharacter,
		sessions: linkSessionsToCharacter,
		notes: linkNotesToCharacter,
		plots: linkPlotsToCharacter,
	});
};
