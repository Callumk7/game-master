import { createFactionSchema } from "@repo/api";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { data } from "@remix-run/node";
import { parseForm } from "zodix";
import { createApi } from "~/lib/api.server";
import { validateUser } from "~/lib/auth.server";
import { successRedirect } from "~/lib/navigation";

export async function createFactionAction(request: Request) {
	const userId = await validateUser(request);
	const api = createApi(userId);
	const formData = await parseForm(request, createFactionSchema.omit({ ownerId: true }));
	const result = await api.factions.create({ ...formData, ownerId: userId });

	if (result.success) {
		const { gameId, id } = result.data;
		return successRedirect({
			path: `/games/${gameId}/factions/${id}`,
			message: "Faction created successfully",
		});
	}

	return data(
		{ errorMsg: "There was a problem creating this faction, please try again." },
		{
			status: StatusCodes.INTERNAL_SERVER_ERROR,
			statusText: ReasonPhrases.INTERNAL_SERVER_ERROR,
		},
	);
}
