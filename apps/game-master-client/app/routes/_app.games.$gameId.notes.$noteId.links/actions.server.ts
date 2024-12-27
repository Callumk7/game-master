import type { SDK } from "@repo/api";

export const updateLinks = async (request: Request, api: SDK, noteId: string) => {
	const data = (await request.json()) as { noteIds: string[] };
	const result = await api.notes.link.update.notes(noteId, data.noteIds);
	return result;
};
