import type { SDK } from "@repo/api";
import { typedjson } from "remix-typedjson";
import { successRedirect } from "~/lib/navigation";

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
