import type { CreateCharacterRequestBody } from "@repo/api/dist/types/characters";
import type { InsertDatabaseCharacter } from "~/db/schema/characters";
import { generateCharacterId } from "~/lib/ids";

export const createCharacterInsert = (
	input: CreateCharacterRequestBody,
): InsertDatabaseCharacter => {
	const currentDate = new Date();
	return {
		id: generateCharacterId(),
		name: input.name,
		ownerId: input.ownerId,
		gameId: input.gameId,
		createdAt: currentDate,
		updatedAt: currentDate,
		content: input.content,
		htmlContent: input.htmlContent,
		primaryFactionId: input.primaryFactionId,
		isPlayer: input.isPlayer,
	};
};
