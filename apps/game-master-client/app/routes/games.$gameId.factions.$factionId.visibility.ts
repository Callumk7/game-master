import { json, type ActionFunction } from "@remix-run/node";
import { visibilitySchema } from "@repo/api";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { api } from "~/lib/api.server";

export const action: ActionFunction = async ({ request, params }) => {
	const { factionId } = parseParams(params, { factionId: z.string() });
	if (request.method === "PATCH") {
		const { visibility } = await parseForm(request, { visibility: visibilitySchema });

		const result = await api.factions.updateFactionDetails(factionId, { visibility });

		if (!result.success) {
			return { error: result.message };
		}

		return json(result.data);
	}
};
