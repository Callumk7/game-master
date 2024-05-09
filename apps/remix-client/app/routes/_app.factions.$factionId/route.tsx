import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { z } from "zod";
import { zx } from "zodix";
import FactionView from "./faction-view";
import { useTypedRouteLoaderData } from "remix-typedjson";
import { OptionalEntitySchema, createDrizzleForTurso } from "@repo/db";
import { handleFactionLoader, handleUpdateFaction } from "./queries.server";
import ky from "ky";
import { validateUser } from "~/lib/auth";

export const loader = async ({ request, params, context }: LoaderFunctionArgs) => {
	const userId = await validateUser(request);
	const { factionId } = zx.parseParams(params, { factionId: z.string() });
	const db = createDrizzleForTurso(context.cloudflare.env);
	return await handleFactionLoader(db, userId, factionId);
};

export const useFactionRouteData = () => {
	const data = useTypedRouteLoaderData<typeof loader>("routes/_app.factions.$factionId");
	if (data === undefined) {
		throw new Error(
			"useFactionRouteData must be used within the _app.faction.$factionId route or it's children",
		);
	}
	return data;
};

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	const { factionId } = zx.parseParams(params, { factionId: z.string() });
	const db = createDrizzleForTurso(context.cloudflare.env);
	if (request.method === "PATCH") {
		return await handleUpdateFaction(db, factionId, request);
	}
	if (request.method === "POST") {
		const { characterIds } = await zx.parseForm(request, {
			characterIds: OptionalEntitySchema,
		});
		const json = await ky
			.post(`${context.cloudflare.env.GAME_MASTER_URL}/factions/${factionId}/members`, {
				json: {
					characterIds: characterIds,
				},
			})
			.json();
		return json;
	}

	if (request.method === "DELETE") {
		const { characterId } = await zx.parseForm(request, { characterId: z.string() });
		const text = await ky
			.delete(
				`${context.cloudflare.env.GAME_MASTER_URL}/factions/${factionId}/members/${characterId}`,
			)
			.text();
		return text;
	}
};

export { FactionView as default };
