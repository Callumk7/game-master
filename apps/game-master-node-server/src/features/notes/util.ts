import type { CreateNoteRequestBody } from "@repo/api";
import type { InsertDatabaseNote } from "~/db/schema/notes";
import { generateNoteId } from "~/lib/ids";
import { getUnsortedFolder } from "../folders/queries";

export const createNoteInsert = async (
	input: CreateNoteRequestBody,
): Promise<InsertDatabaseNote> => {
	const currentDate = new Date();
	if (input.folderId) {
		return {
			id: generateNoteId(),
			name: input.name,
			ownerId: input.ownerId,
			gameId: input.gameId,
			createdAt: currentDate,
			updatedAt: currentDate,
			content: input.content,
			htmlContent: input.htmlContent,
			type: input.type,
			visibility: input.visibility,
			folderId: input.folderId,
		};
	}
	const unsortedFolder = await getUnsortedFolder(input.gameId);
	return {
		id: generateNoteId(),
		name: input.name,
		ownerId: input.ownerId,
		gameId: input.gameId,
		createdAt: currentDate,
		updatedAt: currentDate,
		content: input.content,
		htmlContent: input.htmlContent,
		type: input.type,
		visibility: input.visibility,
		folderId: unsortedFolder.id,
	};
};
