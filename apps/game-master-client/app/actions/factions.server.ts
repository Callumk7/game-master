import { type SDK, updateFactionSchema } from "@repo/api";
import { parseForm } from "zodix";
import { createApi } from "~/lib/api.server";
import { validateUser } from "~/lib/auth.server";
import { successRedirect } from "~/lib/navigation";

export const updateFactionDetails = async (request: Request, factionId: string) => {
	if (request.method === "PATCH") {
		const userId = await validateUser(request);
		const api = createApi(userId);
		const data = await parseForm(request, updateFactionSchema);
		return await api.factions.update(factionId, data);
	}
};

export const deleteFaction = async (api: SDK, factionId: string, gameId: string) => {
	const result = await api.factions.delete(factionId);
	if (result.success) {
		return successRedirect({
			path: `/games/${gameId}/factions`,
			message: "Successfully deleted note",
		});
	}
};
