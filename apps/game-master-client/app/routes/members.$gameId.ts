import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { z } from "zod";
import { parseParams } from "zodix";
import { createApi } from "~/lib/api.server";
import { validateUser } from "~/lib/auth.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const userId = await validateUser(request);
	const api = createApi(userId);
	const { gameId } = parseParams(params, { gameId: z.string() });
	const result = await api.games.getGameWithMembers(gameId);
	return json(result);
};
