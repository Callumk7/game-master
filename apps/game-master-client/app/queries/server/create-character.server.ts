import { json, redirect } from "@remix-run/react";
import { createCharacterSchema } from "@repo/api";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { parseForm } from "zodix";
import { createApi } from "~/lib/api.server";
import { validateUser } from "~/lib/auth.server";

export async function createCharacterAction(request: Request) {
	const userId = await validateUser(request);
	const api = createApi(userId);
	const data = await parseForm(request, createCharacterSchema.omit({ ownerId: true }));
	try {
		const result = await api.characters.createCharacter({ ...data, ownerId: userId });
		if (result.success) {
			const { gameId, id } = result.data;
			return redirect(`/games/${gameId}/characters/${id}`);
		}
	} catch (error) {
		console.error(error);
	}

	return json(
		{ errorMsg: "There was a problem creating this faction, please try again." },
		{
			status: StatusCodes.INTERNAL_SERVER_ERROR,
			statusText: ReasonPhrases.INTERNAL_SERVER_ERROR,
		},
	);
}
