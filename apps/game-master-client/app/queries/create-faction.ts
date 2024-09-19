import { redirect } from "remix-typedjson";
import { z } from "zod";
import { parseForm } from "zodix";
import { api } from "~/lib/api.server";
import { validateUser } from "~/lib/auth.server";

export async function createFactionAction(request: Request) {
	// TODO: This is linked to the create character action, and this approach may
	// not be robust
	const userId = await validateUser(request);

	const data = await parseForm(request, {
		name: z.string(),
		content: z.string(),
		htmlContent: z.string(),
		gameId: z.string(),
	});
	const result = await api.factions.createFaction({ ...data, ownerId: userId });

	if (result.success) {
		const {gameId, id} = result.data;
		return redirect(`/games/${gameId}/factions/${id}`);
	}

	throw new Error("Something went wrong with the api - Factions - Callum error");
}
