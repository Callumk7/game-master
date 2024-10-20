import { json, type ActionFunction } from "@remix-run/node";
import type { ClientActionFunctionArgs } from "@remix-run/react";
import { visibilitySchema } from "@repo/api";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { api } from "~/lib/api.server";

export const action: ActionFunction = async ({ request, params }) => {
	const { noteId } = parseParams(params, { noteId: z.string() });
	if (request.method === "PATCH") {
		const { visibility } = await parseForm(request, { visibility: visibilitySchema });

		const result = await api.notes.updateNote(noteId, { visibility });

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
