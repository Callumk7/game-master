import { data } from "@remix-run/node";
import { type SDK, updateNoteContentSchema } from "@repo/api";
import { parseForm } from "zodix";
import { successRedirect } from "~/lib/navigation";

export const updateNote = async (request: Request, api: SDK, noteId: string) => {
	const formData = await parseForm(request, updateNoteContentSchema);
	const result = await api.notes.update(noteId, formData);
	return data(result);
};

export const deleteNote = async (api: SDK, noteId: string, gameId: string) => {
	const result = await api.notes.delete(noteId);
	if (result.success) {
		return successRedirect({
			path: `/games/${gameId}/notes`,
			message: "Successfully deleted note",
		});
	}
	return data(result);
};
