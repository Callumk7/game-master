import { type SDK, updateNoteContentSchema } from "@repo/api";
import { typedjson } from "remix-typedjson";
import { parseForm } from "zodix";

export const updateNote = async (request: Request, api: SDK, noteId: string) => {
	const data = await parseForm(request, updateNoteContentSchema);
	const result = await api.notes.updateNote(noteId, data);
	return typedjson(result);
};

export const updateLinks = async (request: Request, api: SDK, noteId: string) => {
	const data = (await request.json()) as { noteIds: string[] };
	const result = await api.notes.link.update.notes(noteId, data.noteIds);
	return typedjson(result);
};
