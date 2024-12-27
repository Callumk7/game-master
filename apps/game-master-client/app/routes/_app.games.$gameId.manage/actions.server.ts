import { redirect } from "@remix-run/node";
import { type SDK, updateGameSchema } from "@repo/api";
import { parseForm } from "zodix";
import { unsuccessfulResponse } from "~/util/responses";

export const updateGame = async (request: Request, api: SDK, gameId: string) => {
	const { name, description } = await parseForm(request, updateGameSchema);
	const result = await api.games.update(gameId, { name, description });

	if (!result.success) {
		return unsuccessfulResponse(result.message);
	}

	return redirect(`/games/${gameId}`);
};
