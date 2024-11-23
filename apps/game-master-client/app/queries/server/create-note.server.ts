import { json, redirect } from "@remix-run/react";
import { createNoteSchema } from "@repo/api";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { typedjson } from "remix-typedjson";
import { parseForm } from "zodix";
import { createApi } from "~/lib/api.server";
import { validateUser } from "~/lib/auth.server";
import { successRedirect } from "~/lib/navigation";

export async function createNoteAction(request: Request) {
	const userId = await validateUser(request);
	const api = createApi(userId);
	const data = await parseForm(request, createNoteSchema.omit({ ownerId: true }));
	const result = await api.notes.create({ ...data, ownerId: userId });

	if (result.success) {
		const { gameId, id } = result.data;
		return successRedirect({
			path: `/games/${gameId}/notes/${id}`,
			message: "Note successfully created",
		});
	}

	return typedjson(
		{ errorMsg: "There was a problem creating this note, please try again." },
		{
			status: StatusCodes.INTERNAL_SERVER_ERROR,
			statusText: ReasonPhrases.INTERNAL_SERVER_ERROR,
		},
	);
}
