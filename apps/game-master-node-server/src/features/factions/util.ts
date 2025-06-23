import type { CreateFactionRequestBody } from "@repo/api/dist/types/factions";
import type { InsertDatabaseFaction } from "~/db/schema/factions";
import { generateFactionId } from "~/lib/ids";
import { getUnsortedFolder } from "../folders/queries";

export const createFactionInsert = async (
	input: CreateFactionRequestBody,
): Promise<InsertDatabaseFaction> => {
	const currentDate = new Date();
	if (input.folderId) {
		return {
			id: generateFactionId(),
			name: input.name,
			content: input.content,
			htmlContent: input.htmlContent,
			createdAt: currentDate,
			updatedAt: currentDate,
			coverImageUrl: input.coverImageUrl,
			gameId: input.gameId,
			ownerId: input.ownerId,
			folderId: input.folderId,
		};
	}

	const unsortedFolder = await getUnsortedFolder(input.gameId);
	return {
		id: generateFactionId(),
		name: input.name,
		content: input.content,
		htmlContent: input.htmlContent,
		createdAt: currentDate,
		updatedAt: currentDate,
		coverImageUrl: input.coverImageUrl,
		gameId: input.gameId,
		ownerId: input.ownerId,
		folderId: unsortedFolder.id,
	};
};
