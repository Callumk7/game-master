import { and, eq } from "drizzle-orm";
import { db } from "~/db";
import { folders } from "~/db/schema/notes";
import { generateFolderId } from "~/lib/ids";

export async function getUserFolders(userId: string) {
	return await db.query.folders.findMany({
		where: eq(folders.ownerId, userId),
	});
}

export async function createUnsortedFolder(args: { gameId: string; ownerId: string }) {
	const { gameId, ownerId } = args;
	const now = new Date();
	try {
		await db.insert(folders).values({
			id: generateFolderId(),
			name: "Unsorted",
			gameId,
			ownerId,
			createdAt: now,
			updatedAt: now,
			isDefault: true,
		});

		return { success: true };
	} catch (error) {
		console.error("Unable to create default folder");
		throw error;
	}
}

export async function getUnsortedFolder(gameId: string) {
	const result = await db.query.folders.findFirst({
		where: and(eq(folders.isDefault, true), eq(folders.gameId, gameId)),
	});

	if (!result) {
		throw new Error("Unable to find unsorted folder for game!");
	}

	return result;
}
