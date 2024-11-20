import type { SDK } from "@repo/api";
import { typedjson } from "remix-typedjson";
import { z } from "zod";
import { parseForm } from "zodix";

export const createFolder = async (request: Request, api: SDK, userId: string) => {
	const { name, gameId } = await parseForm(request, {
		name: z.string(),
		gameId: z.string(),
	});
	const newFolder = await api.folders.createFolder({ name, gameId, ownerId: userId });

	if (!newFolder.success) {
		return { success: false };
	}

	return typedjson({ newFolder: newFolder.data });
};
