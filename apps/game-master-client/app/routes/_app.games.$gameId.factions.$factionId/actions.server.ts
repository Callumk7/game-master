import { redirect } from "@remix-run/node";
import { type SDK, duplicateFactionSchema } from "@repo/api";
import { parseForm } from "zodix";
import { factionHref } from "~/util/generate-hrefs";
import { unsuccessfulResponse } from "~/util/responses";

export const duplicateFaction = async (
	request: Request,
	api: SDK,
	factionId: string,
	userId: string,
) => {
	const data = await parseForm(request, duplicateFactionSchema.omit({ ownerId: true }));

	const dupeResult = await api.factions.duplicate(factionId, {
		...data,
		ownerId: userId,
	});

	if (!dupeResult.success) {
		return unsuccessfulResponse(dupeResult.message);
	}

	const { gameId, id } = dupeResult.data;
	return redirect(factionHref(gameId, id));
};
