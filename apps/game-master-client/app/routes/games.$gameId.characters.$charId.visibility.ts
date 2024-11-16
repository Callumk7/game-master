import { type ActionFunction, json } from "@remix-run/node";
import { visibilitySchema } from "@repo/api";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { createApi } from "~/lib/api.server";
import { validateUser } from "~/lib/auth.server";

export const action: ActionFunction = async ({ request, params }) => {
	const userId = await validateUser(request);
	const api = createApi(userId);
	const { charId } = parseParams(params, { charId: z.string() });
	if (request.method === "PATCH") {
		const { visibility } = await parseForm(request, { visibility: visibilitySchema });

		const result = await api.characters.update(charId, {
			visibility,
		});

		if (!result.success) {
			return { error: result.message };
		}

		return json(result.data);
	}
};
