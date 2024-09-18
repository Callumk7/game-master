import type { CreateFactionRequestBody } from "@repo/api/dist/types/factions";
import type { InsertDatabaseFaction } from "~/db/schema/factions";
import { generateFactionId } from "~/lib/ids";

export const createFactionInsert = (input: CreateFactionRequestBody): InsertDatabaseFaction => {
	return {
		id: generateFactionId(),
		name: input.name,
		content: input.content,
		htmlContent: input.htmlContent,
		coverImageUrl: input.coverImageUrl,
		gameId: input.gameId,
		ownerId: input.ownerId,
		leaderId: input.leaderId
	}
}
