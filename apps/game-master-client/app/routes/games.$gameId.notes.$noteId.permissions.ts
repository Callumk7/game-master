import { type ActionFunction, json } from "react-router";
import type { ClientActionFunctionArgs } from "react-router";
import { permissionSchema } from "@repo/api";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { createApi } from "~/lib/api.server";
import { validateUser } from "~/lib/auth.server";

export const action: ActionFunction = async ({ request, params }) => {
	const userId = await validateUser(request);
	const api = createApi(userId);
	const { noteId } = parseParams(params, { noteId: z.string() });
	if (request.method === "PATCH") {
		const { userId, permission } = await parseForm(request, {
			userId: z.string(),
			permission: permissionSchema,
		});

		const result = await api.notes.create.permission(noteId, {
			userId,
			permission,
		});

		if (!result.success) {
			return { error: result.message };
		}

		return json({ permission: result.data });
	}
};

export async function clientAction({ params, serverAction }: ClientActionFunctionArgs) {
	const { noteId } = parseParams(params, {
		noteId: z.string(),
	});

	localStorage.removeItem(noteId);

	const serverData = await serverAction();
	return serverData;
}
