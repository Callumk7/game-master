import { db } from "~/db";
import { notes } from "~/db/schema/notes";
import { generateNoteId } from "~/lib/ids";

interface NewNote {
	name: string;
	htmlContent: string;
	gameId: string;
}

export const createGameNote = async (ownerId: string, newNote: NewNote) => {
	return await db
		.insert(notes)
		.values({
			id: generateNoteId(),
			name: newNote.name,
			htmlContent: newNote.htmlContent,
			gameId: newNote.gameId,
			createdAt: new Date(),
			updatedAt: new Date(),
			ownerId,
			type: "note",
		})
		.returning();
};
