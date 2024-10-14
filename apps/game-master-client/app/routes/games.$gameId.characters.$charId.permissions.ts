import { json, type ActionFunction } from "@remix-run/node";
import { permissionSchema } from "@repo/api";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { api } from "~/lib/api.server";

export const action: ActionFunction = async ({ request, params }) => {
	const { charId } = parseParams(params, { charId: z.string() });
	if (request.method === "PATCH") {
		const { userId, permission } = await parseForm(request, {
			userId: z.string(),
			permission: permissionSchema,
		});

		const result = await api.characters.createCharacterPermission(charId, {
			userId,
			permission,
		});

		if (!result.success) {
			return { error: result.message };
		}

		return json({ permission: result.data });
	}
};
