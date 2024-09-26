import { api } from "~/lib/api.server";
import { resolve } from "~/util/await-all";

export const getNoteData = async (noteId: string) => {
	const noteCall = api.notes.getNote(noteId);
	const linkedCharsCall = api.notes.getLinkedCharacters(noteId);
	const linkedFactionsCall = api.notes.getLinkedFactions(noteId);
	const linkedNotesCall = api.notes.getLinkedNotes(noteId);

	const [note, linkedChars, linkedFactions, linkedNotes] = await resolve(
		noteCall,
		linkedCharsCall,
		linkedFactionsCall,
		linkedNotesCall
	);

	return { note, linkedChars, linkedFactions, linkedNotes };
};
