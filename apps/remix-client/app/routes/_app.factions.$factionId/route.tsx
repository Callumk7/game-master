import {
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	json,
} from "@remix-run/cloudflare";
import { z } from "zod";
import { zx } from "zodix";
import FactionView from "./faction-view";
import { useTypedRouteLoaderData } from "remix-typedjson";
import { createDrizzleForTurso } from "@repo/db";
import { handleFactionLoader, handleUpdateFaction } from "./queries.server";
import ky from "ky";
import { patch } from "~/lib/game-master";

export const loader = async ({ request, params, context }: LoaderFunctionArgs) => {
	const { factionId } = zx.parseParams(params, { factionId: z.string() });
	const db = createDrizzleForTurso(context.cloudflare.env);
	return await handleFactionLoader(db, factionId);
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
	if (request.method === "PATCH") {
		return await handleUpdateFaction(request, context, factionId);
	}
	if (request.method === "POST") {
		const { intent } = await zx.parseForm(request, {
			intent: z.union([z.literal("leader"), z.literal("members")]),
		});
		if (intent === "leader") {
			const form = await request.formData();
			const res = await patch(context, `factions/${factionId}`, form);
			return json(await res.json());
		}
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
