import type { CreateFactionRequestBody } from "@repo/api/dist/types/factions";
import type { InsertDatabaseFaction } from "~/db/schema/factions";
import { generateFactionId } from "~/lib/ids";

export const createFactionInsert = (input: CreateFactionRequestBody): InsertDatabaseFaction => {
	const currentDate = new Date();
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
		leaderId: input.leaderId
	}
}
