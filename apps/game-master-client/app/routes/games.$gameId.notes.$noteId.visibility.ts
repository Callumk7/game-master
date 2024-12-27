import { type ActionFunction, json } from "react-router";
import type { ClientActionFunctionArgs } from "react-router";
import { visibilitySchema } from "@repo/api";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { createApi } from "~/lib/api.server";
import { validateUser } from "~/lib/auth.server";

export const action: ActionFunction = async ({ request, params }) => {
	const userId = await validateUser(request);
	const api = createApi(userId);
	const { noteId } = parseParams(params, { noteId: z.string() });
	if (request.method === "PATCH") {
		const { visibility } = await parseForm(request, { visibility: visibilitySchema });

		const result = await api.notes.update(noteId, { visibility });

		if (!result.success) {
			return { error: result.message };
		}

		return json(result.data);
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
