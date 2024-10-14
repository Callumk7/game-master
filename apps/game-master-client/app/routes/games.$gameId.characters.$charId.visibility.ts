import { json, type ActionFunction } from "@remix-run/node";
import { visibilitySchema } from "@repo/api";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { api } from "~/lib/api.server";

export const action: ActionFunction = async ({ request, params }) => {
	const { charId } = parseParams(params, { charId: z.string() });
	if (request.method === "PATCH") {
		const { visibility } = await parseForm(request, { visibility: visibilitySchema });

		const result = await api.characters.updateCharacterDetails(charId, { visibility });

		if (!result.success) {
			return { error: result.message };
		}

		return json(result.data);
	}
};
