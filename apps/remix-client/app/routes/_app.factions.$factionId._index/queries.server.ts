import { type AppLoadContext, json } from "@remix-run/cloudflare";
import { internalServerError } from "@repo/db";
import { patch } from "~/lib/game-master";

export const handleForwardUpdateFactionRequest = async (
	context: AppLoadContext,
	factionId: string,
	request: Request,
) => {
	const form = await request.formData();
	const res = await patch(context, `factions/${factionId}`, form);

	if (res.ok) {
		return json(await res.json());
	}

	return internalServerError();
};
