import type {
	CharacterWithNotes,
	CharacterWithPermissions,
	NoteType,
	Permission,
	UpdateCharacterRequestBody,
} from "@repo/api";
import { eq, sql } from "drizzle-orm";
import { db } from "~/db";
import {
	characters,
	charactersPermissions,
	type InsertDatabaseCharacter,
} from "~/db/schema/characters";

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
		.set(updateData)
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

export const getCharacterWithNotes = async (
	characterId: string,
): Promise<CharacterWithNotes> => {
	const characterResult = await db.query.characters.findFirst({
		where: eq(characters.id, characterId),
		with: {
			notes: {
				with: {
					note: true,
				},
			},
		},
	});

	if (!characterResult) {
		throw new Error("Failed to find a character from the database.");
	}

	return {
		...characterResult,
		notes: characterResult.notes.map((note) => ({
			...note.note,
			type: note.note.type as NoteType,
		})),
	};
};
