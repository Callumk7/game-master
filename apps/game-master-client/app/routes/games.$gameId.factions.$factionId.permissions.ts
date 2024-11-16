import { type ActionFunction, json } from "@remix-run/node";
import { permissionSchema } from "@repo/api";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { createApi } from "~/lib/api.server";
import { validateUser } from "~/lib/auth.server";

export const action: ActionFunction = async ({ request, params }) => {
	const userId = await validateUser(request);
	const api = createApi(userId);
	const { factionId } = parseParams(params, { factionId: z.string() });
	if (request.method === "PATCH") {
		const { userId, permission } = await parseForm(request, {
			userId: z.string(),
			permission: permissionSchema,
		});

		const result = await api.factions.create.permission(factionId, {
			userId,
			permission,
		});

		if (!result.success) {
			return { error: result.message };
		}

		return json({ permission: result.data });
	}
};
