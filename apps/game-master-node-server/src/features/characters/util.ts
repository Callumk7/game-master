import type { CreateCharacterRequestBody } from "@repo/api/dist/types/characters";
import type { InsertDatabaseCharacter } from "~/db/schema/characters";
import { generateCharacterId } from "~/lib/ids";

export const createCharacterInsert = (
	input: CreateCharacterRequestBody,
): InsertDatabaseCharacter => {
	const currentDate = new Date();
	return {
		...input,
		id: generateCharacterId(),
		createdAt: currentDate,
		updatedAt: currentDate,
	};
};
