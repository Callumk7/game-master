import { json, type ActionFunction } from "@remix-run/node";
import { ClientActionFunctionArgs } from "@remix-run/react";
import { permissionSchema } from "@repo/api";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { api } from "~/lib/api.server";

export const action: ActionFunction = async ({ request, params }) => {
	const { noteId } = parseParams(params, { noteId: z.string() });
	if (request.method === "PATCH") {
		const { userId, permission } = await parseForm(request, {
			userId: z.string(),
			permission: permissionSchema,
		});

		const result = await api.notes.createNotePermission(noteId, {
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
