import { updateNoteContentSchema, type SDK } from "@repo/api";
import { typedjson } from "remix-typedjson";
import { parseForm } from "zodix";
import { successRedirect } from "~/lib/navigation";

export const updateNote = async (request: Request, api: SDK, noteId: string) => {
	const data = await parseForm(request, updateNoteContentSchema);
	const result = await api.notes.update(noteId, data);
	return typedjson(result);
};

export const deleteNote = async (api: SDK, noteId: string, gameId: string) => {
	const result = await api.notes.delete(noteId);
	if (result.success) {
		return successRedirect({
			path: `/games/${gameId}/notes`,
			message: "Successfully deleted note",
		});
	}
	return typedjson(result);
};
