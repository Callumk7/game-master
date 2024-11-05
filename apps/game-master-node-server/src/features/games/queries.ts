import type {
	Character,
	CharacterWithFaction,
	Faction,
	GameWithDatedEntities,
	GameWithMembers,
	Id,
	Note,
} from "@repo/api";
import { and, eq, inArray, ne } from "drizzle-orm";
import { db } from "~/db";
import { characters, charactersPermissions } from "~/db/schema/characters";
import { factions, factionsPermissions } from "~/db/schema/factions";
import { type InsertDatabaseGame, games, usersToGames } from "~/db/schema/games";
import { notes, notesPermissions } from "~/db/schema/notes";
import { filterItems } from "~/lib/permissions-filter";
import { resolve } from "~/utils";

export const createGame = async (insert: InsertDatabaseGame) => {
	const result = await db
		.insert(games)
		.values(insert)
		.returning()
		.then((result) => result[0]);

	if (!result) {
		throw new Error("Database failed to create new game");
	}

	try {
		await db.insert(usersToGames).values({
			gameId: insert.id,
			userId: insert.ownerId,
			isOwner: true,
		});
	} catch (error) {
		console.error(error);
		throw new Error("Failed to create a game and user link");
	}

	return result;
};

export const getGameWithMembers = async (gameId: Id): Promise<GameWithMembers> => {
	const game = await db.query.games.findFirst({
		where: eq(games.id, gameId),
		with: {
			members: {
				with: {
					user: true,
				},
			},
		},
	});

	if (!game) {
		throw new Error("Unable to find game in database");
	}

	const transformedResult: GameWithMembers = {
		...game,
		members: game.members.map((m) => ({
			...m.user,
			role: m.role,
			isOwner: m.isOwner,
		})),
	};

	return transformedResult;
};

export const getGameWithData = async (
	userId: Id,
	gameId: Id,
): Promise<GameWithDatedEntities> => {
	const gameResult = await db.query.games.findFirst({
		where: eq(games.id, gameId),
		with: {
			characters: {
				with: {
					permissions: true,
				},
			},
			factions: {
				with: {
					permissions: true,
				},
			},
			notes: {
				with: {
					permissions: true,
				},
			},
			folders: true,
		},
	});

	if (!gameResult) {
		throw new Error("Unable to find game");
	}

	const characterData = gameResult.characters.filter((char) =>
		filterItems(userId, {
			ownerId: char.ownerId,
			visibility: char.visibility,
			permissions: char.permissions,
		}),
	);
	const noteData = gameResult.notes.filter((note) =>
		filterItems(userId, {
			ownerId: note.ownerId,
			visibility: note.visibility,
			permissions: note.permissions,
		}),
	);
	const factionData = gameResult.factions.filter((faction) =>
		filterItems(userId, {
			ownerId: faction.ownerId,
			visibility: faction.visibility,
			permissions: faction.permissions,
		}),
	);

	const folderData = gameResult.folders;

	const createNestedFolders = (
		gameFolders: typeof folderData,
		parentId: Id | null = null,
		// biome-ignore lint/suspicious/noExplicitAny: This complex nested structure needs to be figured out..
	): any[] => {
		return gameFolders
			.filter((f) => f.parentFolderId === parentId)
			.map((folder) => ({
				...folder,
				notes: noteData.filter((n) => n.folderId === folder.id),
				characters: characterData.filter((c) => c.folderId === folder.id),
				factions: factionData.filter((f) => f.folderId === folder.id),
				children: createNestedFolders(gameFolders, folder.id),
			}));
	};

	// Assemble the final structure
	const gameData = {
		...gameResult,
		notes: noteData.filter((n) => n.gameId === gameId && !n.folderId),
		characters: characterData.filter((c) => c.gameId === gameId && !c.folderId),
		factions: factionData.filter((f) => f.gameId === gameId && !f.folderId),
		folders: createNestedFolders(folderData),
	};

	return gameData;
};

export const deleteMembers = async (gameId: Id) => {
	await db
		.delete(usersToGames)
		.where(and(eq(usersToGames.gameId, gameId), eq(usersToGames.isOwner, false)));
};

export const getMemberIdArray = async (gameId: Id): Promise<string[]> => {
	return await db
		.select({ userId: usersToGames.userId })
		.from(usersToGames)
		.where(eq(usersToGames.gameId, gameId))
		.then((rows) => rows.map((row) => row.userId));
};

export const handleAddMembers = async (gameId: Id, membersToAdd: Id[]) => {
	if (membersToAdd.length > 0) {
		const dbInsert = membersToAdd.map((member) => ({ userId: member, gameId }));
		await db.insert(usersToGames).values(dbInsert);
	}
};

export const handleRemoveMembers = async (gameId: Id, membersToRemove: Id[]) => {
	if (membersToRemove.length > 0) {
		await db
			.delete(usersToGames)
			.where(
				and(
					eq(usersToGames.gameId, gameId),
					inArray(usersToGames.userId, membersToRemove),
				),
			);
	}
};

export const getUserNotesForGame = async (gameId: Id, userId: Id): Promise<Note[]> => {
	const [ownedNotes, visibleNotes] = await resolve(
		getOwnedNotes(gameId, userId),
		getVisibleNotes(gameId, userId),
	);

	return ownedNotes.concat(
		visibleNotes.filter(
			(note) => !ownedNotes.some((ownedNote) => ownedNote.id === note.id),
		),
	);
};

export const getUserFactionsForGame = async (
	gameId: Id,
	userId: Id,
): Promise<Faction[]> => {
	const [ownedFactions, visibleFactions] = await resolve(
		getOwnedFactions(gameId, userId),
		getVisibleFactions(gameId, userId),
	);

	return ownedFactions.concat(
		visibleFactions.filter(
			(faction) =>
				!ownedFactions.some((ownedFaction) => ownedFaction.id === faction.id),
		),
	);
};

export const getUserCharactersForGame = async (
	gameId: Id,
	userId: Id,
): Promise<Character[]> => {
	const [ownedChars, visibleChars] = await resolve(
		getOwnedCharacters(gameId, userId),
		getVisibleCharacters(gameId, userId),
	);

	return ownedChars.concat(
		visibleChars.filter(
			(char) => !ownedChars.some((ownedChar) => ownedChar.id === char.id),
		),
	);
};

export const getUserCharactersForGameWithFaction = async (
	gameId: Id,
	userId: Id,
): Promise<CharacterWithFaction[]> => {
	const [ownedChars, visibleChars] = await resolve(
		getOwnedCharactersWithFaction(gameId, userId),
		getVisibleCharactersWithFaction(gameId, userId),
	);

	return ownedChars.concat(
		visibleChars.filter(
			(char) => !ownedChars.some((ownedChar) => ownedChar.id === char.id),
		),
	);
};

const getOwnedNotes = async (gameId: Id, userId: Id) => {
	const notesResult = await db.query.notes.findMany({
		where: and(eq(notes.gameId, gameId), eq(notes.ownerId, userId)),
	});

	return notesResult;
};

const getVisibleNotes = async (gameId: Id, userId: Id) => {
	const notesResult = await db.query.notes
		.findMany({
			where: and(eq(notes.gameId, gameId), ne(notes.visibility, "private")),
			with: {
				permissions: {
					where: eq(notesPermissions.userId, userId),
				},
			},
		})
		.then((result) =>
			result.filter((note) => note.permissions[0]?.permission !== "none"),
		);

	return notesResult;
};

const getOwnedFactions = async (gameId: Id, userId: Id) => {
	const factionResult = await db.query.factions.findMany({
		where: and(eq(factions.gameId, gameId), eq(factions.ownerId, userId)),
	});

	return factionResult;
};

const getVisibleFactions = async (gameId: Id, userId: Id) => {
	const factionResult = await db.query.factions
		.findMany({
			where: and(eq(factions.gameId, gameId), ne(factions.visibility, "private")),
			with: {
				permissions: {
					where: eq(factionsPermissions.userId, userId),
				},
			},
		})
		.then((result) =>
			result.filter((faction) => faction.permissions[0]?.permission !== "none"),
		);

	return factionResult;
};

const getOwnedCharacters = async (gameId: Id, userId: Id) => {
	const charResult = await db.query.characters.findMany({
		where: and(eq(characters.gameId, gameId), eq(characters.ownerId, userId)),
	});

	return charResult;
};

const getVisibleCharacters = async (gameId: Id, userId: Id) => {
	const charResult = await db.query.characters
		.findMany({
			where: and(
				eq(characters.gameId, gameId),
				ne(characters.visibility, "private"),
			),
			with: {
				permissions: {
					where: eq(charactersPermissions.userId, userId),
				},
			},
		})
		.then((result) =>
			result.filter((char) => char.permissions[0]?.permission !== "none"),
		);

	return charResult;
};

const getOwnedCharactersWithFaction = async (gameId: Id, userId: Id) => {
	const charResult = await db.query.characters.findMany({
		where: and(eq(characters.gameId, gameId), eq(characters.ownerId, userId)),
		with: { primaryFaction: true },
	});

	return charResult;
};

const getVisibleCharactersWithFaction = async (gameId: Id, userId: Id) => {
	const charResult = await db.query.characters
		.findMany({
			where: and(
				eq(characters.gameId, gameId),
				ne(characters.visibility, "private"),
			),
			with: {
				permissions: {
					where: eq(charactersPermissions.userId, userId),
				},
				primaryFaction: true,
			},
		})
		.then((result) =>
			result.filter((char) => char.permissions[0]?.permission !== "none"),
		);

	return charResult;
};
