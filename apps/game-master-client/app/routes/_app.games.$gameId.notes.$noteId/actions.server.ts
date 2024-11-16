import { type SDK, duplicateNoteSchema } from "@repo/api";
import { redirect, typedjson } from "remix-typedjson";
import { parseForm } from "zodix";
import { unsuccessfulResponse } from "~/util/responses";

export const duplicateNote = async (
	request: Request,
	api: SDK,
	noteId: string,
	userId: string,
) => {
	const data = await parseForm(request, duplicateNoteSchema.omit({ ownerId: true }));

	const duplicatedNote = await api.notes.duplicate(noteId, {
		...data,
		ownerId: userId,
	});

	if (!duplicatedNote.success) {
		return unsuccessfulResponse(duplicatedNote.message);
	}

	return redirect(
		`/games/${duplicatedNote.data.gameId}/notes/${duplicatedNote.data.id}`,
	);
};

export const deleteNote = async (api: SDK, noteId: string) => {
	const result = await api.notes.delete(noteId);
	if (result.success) {
		return redirect("/games");
	}
	return typedjson(result);
};
