import type { SDK } from "@repo/api";
import { typedjson } from "remix-typedjson";
import { z } from "zod";
import { parseForm } from "zodix";
import { getData } from "~/util/handle-error";

export const updateGameDetails = async (request: Request, gameId: string, api: SDK) => {
	const { name } = await parseForm(request, {
		name: z.string(),
	});

	const result = await getData(() => api.games.updateGameDetails(gameId, { name }));
	return typedjson(result);
};
