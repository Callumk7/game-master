import { json, type ActionFunction } from "@remix-run/node";
import { permissionSchema } from "@repo/api";
import { z } from "zod";
import { parseParams } from "zodix";
import { api } from "~/lib/api.server";

export const action: ActionFunction = async ({ request, params }) => {
	const { noteId } = parseParams(params, { noteId: z.string() });
	if (request.method === "PATCH") {
		// TODO: handle this exeption
		const permission = permissionSchema.parse(await request.json());

		const result = await api.notes.createNotePermission(noteId, permission);

		if (!result.success) {
			return { error: result.message };
		}

		return json({ permission: result.data });
	}
};
