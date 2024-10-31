import { roleSchema, type SDK } from "@repo/api";
import { typedjson } from "remix-typedjson";
import { z } from "zod";
import { parseForm } from "zodix";
import { unsuccessfulResponse } from "~/util/responses";

export const updateMemberDetails = async (request: Request, api: SDK, gameId: string) => {
	const { userId, role } = await parseForm(request, {
		userId: z.string(),
		role: roleSchema,
	});
	const result = await api.games.editMember(gameId, userId, { role });
	return typedjson(result);
};

export const updateGameMembers = async (request: Request, api: SDK, gameId: string) => {
	try {
		const { userIds } = (await request.json()) as { userIds: string[] };

		const result = await api.games.updateMembers(gameId, userIds);
		return typedjson(result);
	} catch (error) {
		console.error(error);
		return unsuccessfulResponse(String(error)); // TODO: this whole flow is very flakey
	}
};

export const removeMember = async (request: Request, api: SDK, gameId: string) => {
    const { userId } = await parseForm(request, { userId: z.string() });
    const result = await api.games.removeMember(gameId, userId);
    return typedjson(result);
}