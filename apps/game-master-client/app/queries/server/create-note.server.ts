import { json, redirect } from "@remix-run/react";
import { createNoteSchema } from "@repo/api";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { parseForm } from "zodix";
import { api } from "~/lib/api.server";
import { validateUser } from "~/lib/auth.server";

export async function createNoteAction(request: Request) {
	const userId = await validateUser(request);
	const data = await parseForm(
		request,
		createNoteSchema.omit({ ownerId: true }),
	);
	const result = await api.notes.createNote({ ...data, ownerId: userId });
	console.log(result)

	if (result.success) {
		const { gameId, id } = result.data;
		return redirect(`/games/${gameId}/notes/${id}`);
	}

	return json(
		{ errorMsg: "There was a problem creating this note, please try again." },
		{
			status: StatusCodes.INTERNAL_SERVER_ERROR,
			statusText: ReasonPhrases.INTERNAL_SERVER_ERROR,
		},
	);
}
