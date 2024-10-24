import type { SDK } from "@repo/api";
import { resolve } from "~/util/await-all";

export const getNoteData = async (api: SDK, noteId: string) => {
	const noteCall = api.notes.getNoteWithPermissions(noteId);
	const linkedCharsCall = api.notes.getLinkedCharacters(noteId);
	const linkedFactionsCall = api.notes.getLinkedFactions(noteId);
	const linkedNotesCall = api.notes.getLinkedNotes(noteId);

	const [note, linkedChars, linkedFactions, linkedNotes] = await resolve(
		noteCall,
		linkedCharsCall,
		linkedFactionsCall,
		linkedNotesCall,
	);

	return { note, linkedChars, linkedFactions, linkedNotes };
};
