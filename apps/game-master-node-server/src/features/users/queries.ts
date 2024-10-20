import type {
	Id,
	User,
	UserPermission,
	UserWithSidebarData,
	Visibility,
} from "@repo/api";
import { eq, inArray } from "drizzle-orm";
import { db } from "~/db";
import { characters } from "~/db/schema/characters";
import { factions } from "~/db/schema/factions";
import { games, usersToGames } from "~/db/schema/games";
import { folders, notes } from "~/db/schema/notes";
import { users } from "~/db/schema/users";
import { filterItems } from "~/lib/permissions-filter";
import { resolve } from "~/utils";

export const getOwnedGamesWithConnections = async (userId: Id) => {
	return await db.query.games.findMany({
		where: eq(games.ownerId, userId),
		with: {
			notes: true,
			characters: {
				with: {
					notes: {
						columns: {
							noteId: true,
						},
					},
				},
			},
			factions: {
				with: {
					notes: {
						columns: {
							noteId: true,
						},
					},
					members: {
						columns: {
							characterId: true,
						},
					},
				},
			},
		},
	});
};

export const getUser = async (userId: Id): Promise<User | undefined> => {
	return await db
		.select({
			id: users.id,
			firstName: users.firstName,
			lastName: users.lastName,
			username: users.username,
			email: users.email,
		})
		.from(users)
		.where(eq(users.id, userId))
		.then((rows) => rows[0]);
};

export const getSidebarData = async (
	userId: Id,
): Promise<UserWithSidebarData | undefined> => {
	// Fetch user data
	const user = await db.query.users.findFirst({
		where: eq(users.id, userId),
	});

	if (!user) {
		return undefined;
	}

	// Fetch user's games
	const userGames = await db.query.usersToGames.findMany({
		where: eq(usersToGames.userId, userId),
		columns: {
			gameId: true,
		},
	});

	const gameIds = userGames.map((ug) => ug.gameId);

	// Fetch all relevant data in parallel
	const [gameData, noteData, characterData, factionsData, folderData] = await resolve(
		db.query.games.findMany({
			where: inArray(games.id, gameIds),
		}),
		db.query.notes.findMany({
			where: inArray(notes.gameId, gameIds),
			with: {
				permissions: true,
			},
		}),
		db.query.characters.findMany({
			where: inArray(characters.gameId, gameIds),
			with: {
				permissions: true,
			},
		}),
		db.query.factions.findMany({
			where: inArray(factions.gameId, gameIds),
			with: {
				permissions: true,
			},
		}),
		db.query.folders.findMany({
			where: inArray(folders.gameId, gameIds),
		}),
	);

	const filteredNotes = noteData.filter((note) =>
		filterItems(userId, {
			ownerId: note.ownerId,
			visibility: note.visibility,
			permissions: note.permissions,
		}),
	);
	const filteredCharacters = characterData.filter((note) =>
		filterItems(userId, {
			ownerId: note.ownerId,
			visibility: note.visibility,
			permissions: note.permissions,
		}),
	);
	const filteredFactions = factionsData.filter((note) =>
		filterItems(userId, {
			ownerId: note.ownerId,
			visibility: note.visibility,
			permissions: note.permissions,
		}),
	);

	// Helper function to create a nested folder structure
	const createNestedFolders = (
		gameFolders: typeof folderData,
		parentId: Id | null = null,
	): any[] => {
		return gameFolders
			.filter((f) => f.parentFolderId === parentId)
			.map((folder) => ({
				...folder,
				notes: filteredNotes.filter((n) => n.folderId === folder.id),
				characters: filteredCharacters.filter((c) => c.folderId === folder.id),
				factions: filteredFactions.filter((f) => f.folderId === folder.id),
				children: createNestedFolders(gameFolders, folder.id),
			}));
	};

	// Assemble the final structure
	const gamesWithData = gameData.map((game) => {
		const gameFolders = folderData.filter((f) => f.gameId === game.id);
		return {
			...game,
			notes: filteredNotes.filter((n) => n.gameId === game.id && !n.folderId),
			characters: filteredCharacters.filter(
				(c) => c.gameId === game.id && !c.folderId,
			),
			factions: filteredFactions.filter((f) => f.gameId === game.id && !f.folderId),
			folders: createNestedFolders(gameFolders),
		};
	});

	return {
		...user,
		games: gamesWithData,
	};
};
