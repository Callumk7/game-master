import { type SDK, updateNoteContentSchema } from "@repo/api";
import { typedjson } from "remix-typedjson";
import { parseForm } from "zodix";

export const updateNote = async (request: Request, api: SDK, noteId: string) => {
	const data = await parseForm(request, updateNoteContentSchema);
	const result = await api.notes.update(noteId, data);
	return typedjson(result);
};
