import type { CreateNoteRequestBody } from "@repo/api";
import type { InsertDatabaseNote } from "~/db/schema/notes";
import { generateNoteId } from "~/lib/ids";

export const createNoteInsert = (input: CreateNoteRequestBody): InsertDatabaseNote => {
	const currentDate = new Date();
	return {
		id: generateNoteId(),
		name: input.name,
		ownerId: input.ownerId,
		gameId: input.gameId,
		createdAt: currentDate,
		updatedAt: currentDate,
		type: input.type
	}
}
