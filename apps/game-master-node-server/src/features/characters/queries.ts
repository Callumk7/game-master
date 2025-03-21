import type {
	CharacterWithPermissions,
	FactionWithMembers,
	Permission,
	UpdateCharacterRequestBody,
} from "@repo/api";
import { and, eq, sql } from "drizzle-orm";
import { db } from "~/db";
import {
	type InsertDatabaseCharacter,
	characters,
	charactersInFactions,
	charactersPermissions,
	notesOnCharacters,
} from "~/db/schema/characters";
import { images } from "~/db/schema/images";
import { updatedNow } from "~/utils";

export const createCharacter = async (insert: InsertDatabaseCharacter) => {
	const newCharResult = await db
		.insert(characters)
		.values(insert)
		.returning()
		.then((result) => result[0]);

	if (!newCharResult) {
		throw new Error("Failed to return data from database.");
	}

	return newCharResult;
};

export const updateCharacter = async (
	characterId: string,
	updateData: UpdateCharacterRequestBody,
) => {
	const charUpdate = await db
		.update(characters)
		.set(updatedNow(updateData))
		.where(eq(characters.id, characterId))
		.returning()
		.then((result) => result[0]);

	if (!charUpdate) {
		throw new Error("Failed to return data from database.");
	}

	return charUpdate;
};

export const getCharacterWithPermissions = async (
	characterId: string,
): Promise<CharacterWithPermissions> => {
	const charResult = await db.query.characters.findFirst({
		where: eq(characters.id, characterId),
		with: {
			permissions: {
				columns: {
					userId: true,
					permission: true,
				},
			},
		},
	});

	if (!charResult) {
		throw new Error("Failed to find a character from the database.");
	}

	return charResult;
};

export async function createCharacterPermission(
	userId: string,
	characterId: string,
	permission: Permission,
) {
	const result = await db
		.insert(charactersPermissions)
		.values({
			userId,
			characterId,
			permission,
		})
		.onConflictDoUpdate({
			target: [charactersPermissions.userId, charactersPermissions.characterId],
			set: {
				permission: sql`excluded.permission`,
			},
		})
		.returning()
		.then((rows) => rows[0]);

	if (!result) {
		throw new Error("Error creating character permission in database");
	}

	return result;
}

export const getCharacterFactions = async (charId: string) => {
	return await db.query.charactersInFactions
		.findMany({
			where: eq(charactersInFactions.characterId, charId),
			with: {
				faction: true,
			},
		})
		.then((result) => result.map((row) => row.faction));
};

export const getCharacterFactionsWithMembers = async (
	charId: string,
): Promise<FactionWithMembers[]> => {
	return await db.query.charactersInFactions
		.findMany({
			where: eq(charactersInFactions.characterId, charId),
			with: {
				faction: {
					with: { members: { with: { character: true } } },
				},
			},
		})
		.then((result) =>
			result.map((row) => ({
				...row.faction,
				members: row.faction.members.map((m) => ({
					...m.character,
					role: m.role,
				})),
			})),
		);
};

export const linkCharacterToFactions = async (charId: string, factionIds: string[]) => {
	const linkInsert = factionIds.map((id) => ({
		characterId: charId,
		factionId: id,
	}));
	return await db
		.insert(charactersInFactions)
		.values(linkInsert)
		.returning()
		.onConflictDoNothing();
};

export const unlinkCharacterFromFaction = async (charId: string, factionId: string) => {
	await db
		.delete(charactersInFactions)
		.where(
			and(
				eq(charactersInFactions.characterId, charId),
				eq(charactersInFactions.factionId, factionId),
			),
		);
};

export const updateCharacterToFactionLinks = async (
	charId: string,
	factionIds: string[],
) => {
	const linkInsert = factionIds.map((id) => ({
		characterId: charId,
		factionId: id,
	}));
	await db
		.delete(charactersInFactions)
		.where(eq(charactersInFactions.characterId, charactersInFactions));
	return await db
		.insert(charactersInFactions)
		.values(linkInsert)
		.returning()
		.onConflictDoNothing();
};

export const getCharacterNotes = async (charId: string) => {
	return await db.query.notesOnCharacters
		.findMany({
			where: eq(notesOnCharacters.characterId, charId),
			with: {
				note: true,
			},
		})
		.then((result) => result.map((row) => row.note));
};

export const linkCharacterToNotes = async (charId: string, noteIds: string[]) => {
	const linkInsert = noteIds.map((id) => ({
		characterId: charId,
		noteId: id,
	}));
	return await db
		.insert(notesOnCharacters)
		.values(linkInsert)
		.returning()
		.onConflictDoNothing();
};

export const updateCharacterNotes = async (charId: string, noteIds: string[]) => {
	const linkInsert = noteIds.map((id) => ({
		characterId: charId,
		noteId: id,
	}));
	await db.delete(notesOnCharacters).where(eq(notesOnCharacters.characterId, charId));
	return await db
		.insert(notesOnCharacters)
		.values(linkInsert)
		.returning()
		.onConflictDoNothing();
};

export const getCharactersPrimaryFaction = async (
	charId: string,
): Promise<FactionWithMembers | null> => {
	const charFactionResult = await db.query.characters
		.findFirst({
			where: eq(characters.id, charId),
			with: {
				primaryFaction: {
					with: {
						members: { with: { character: true } },
					},
				},
			},
		})
		.then((result) => {
			if (result?.primaryFaction) {
				return {
					...result.primaryFaction,
					members: result.primaryFaction.members.map((m) => ({
						...m.character,
						role: m.role,
					})),
				};
			}
		});

	if (!charFactionResult) {
		return null;
	}

	return charFactionResult;
};

export const getCharacterImages = async (charId: string) => {
	return await db.query.images.findMany({
		where: eq(images.characterId, charId),
	});
};
