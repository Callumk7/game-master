import type { CreateCharacterRequestBody } from "@repo/api/dist/types/characters";
import type { InsertDatabaseCharacter } from "~/db/schema/characters";
import { generateCharacterId } from "~/lib/ids";
import { getUnsortedFolder } from "../folders/queries";

export const createCharacterInsert = async (
	input: CreateCharacterRequestBody,
): Promise<InsertDatabaseCharacter> => {
	const currentDate = new Date();
	if (input.folderId) {
		return {
			...input,
			id: generateCharacterId(),
			createdAt: currentDate,
			updatedAt: currentDate,
			folderId: input.folderId,
		};
	}
	const unsortedFolder = await getUnsortedFolder(input.gameId);
	return {
		...input,
		id: generateCharacterId(),
		createdAt: currentDate,
		updatedAt: currentDate,
		folderId: unsortedFolder.id,
	};
};
