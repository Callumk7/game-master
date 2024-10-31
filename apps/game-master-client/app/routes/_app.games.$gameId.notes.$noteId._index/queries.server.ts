import type { SDK } from "@repo/api";
import { resolve } from "~/util/await-all";
import { getData } from "~/util/handle-error";

export const getNoteData = async (api: SDK, noteId: string, gameId: string) => {
	const noteCall = getData(() => api.notes.getNoteWithPermissions(noteId));
	const linkedCharsCall = getData(() => api.notes.getLinkedCharacters(noteId));
	const linkedFactionsCall = getData(() => api.notes.getLinkedFactions(noteId));
	const linkedNotesCall = getData(() => api.notes.getLinkedNotes(noteId));
	const foldersCall = getData(() => api.folders.getGameFolders(gameId));

	const [note, linkedChars, linkedFactions, linkedNotes, folders] = await resolve(
		noteCall,
		linkedCharsCall,
		linkedFactionsCall,
		linkedNotesCall,
		foldersCall,
	);

	return { note, linkedChars, linkedFactions, linkedNotes, folders };
};
