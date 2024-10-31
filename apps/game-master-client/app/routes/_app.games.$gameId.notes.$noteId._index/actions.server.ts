import { type SDK, duplicateNoteSchema, updateNoteContentSchema } from "@repo/api";
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

	const duplicatedNote = await api.notes.duplicateNote(noteId, {
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

export const updateNote = async (request: Request, api: SDK, noteId: string) => {
	const data = await parseForm(request, updateNoteContentSchema);
	const result = await api.notes.updateNote(noteId, data);
	return typedjson(result);
};

export const deleteNote = async (api: SDK, noteId: string) => {
	const result = await api.notes.deleteNote(noteId);
	if (result.success) {
		return redirect("/games");
	}
	return typedjson(result);
};
