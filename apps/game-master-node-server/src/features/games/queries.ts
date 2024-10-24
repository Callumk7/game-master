import type { GameWithMembers, Id, Note } from "@repo/api";
import { and, eq, inArray, ne } from "drizzle-orm";
import { db } from "~/db";
import { games, usersToGames, type InsertDatabaseGame } from "~/db/schema/games";
import { notes, notesPermissions } from "~/db/schema/notes";
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
		console.error(error)
		throw new Error("Failed to create a game and user link");
	}

	return result;
};

export const getGameWithMembers = async (
	gameId: Id,
): Promise<GameWithMembers> => {
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
		throw new Error("Unable to find game in database")
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
		getVisibileNotes(gameId, userId),
	);

	return ownedNotes.concat(
		visibleNotes.filter(
			(note) => !ownedNotes.some((ownedNote) => ownedNote.id === note.id),
		),
	);
};

const getOwnedNotes = async (gameId: Id, userId: Id) => {
	const notesResult = await db.query.notes.findMany({
		where: and(eq(notes.gameId, gameId), eq(notes.ownerId, userId)),
	});

	return notesResult;
};

const getVisibileNotes = async (gameId: Id, userId: Id) => {
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
