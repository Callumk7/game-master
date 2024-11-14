import { updateFactionSchema } from "@repo/api";
import { parseForm } from "zodix";
import { createApi } from "~/lib/api.server";
import { validateUser } from "~/lib/auth.server";

export const updateFactionDetails = async (request: Request, factionId: string) => {
	if (request.method === "PATCH") {
		const userId = await validateUser(request);
		const api = createApi(userId);
		const data = await parseForm(request, updateFactionSchema);
		return await api.factions.updateFactionDetails(factionId, data);
	}
};
