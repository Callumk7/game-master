import { redirect, typedjson } from "remix-typedjson";
import { z } from "zod";
import { parseForm } from "zodix";
import { api } from "~/lib/api.server";
import { validateUser } from "~/lib/auth.server";

export async function createCharacterAction(request: Request) {
	// throws redirect
	const userId = await validateUser(request);
	// throws error
	// TODO: This should be handled better than this
	const data = await parseForm(request, {
		name: z.string(),
		content: z.string(),
		htmlContent: z.string(),
		gameId: z.string(),
	});
	const result = await api.characters.createCharacter({ ...data, ownerId: userId });

	if (result.success) {
		const { gameId, id } = result.data;
		return redirect(`/games/${gameId}/characters/${id}`);
	}

	throw new Error("Something went wrong with the api - Characters - Callum error");
}
