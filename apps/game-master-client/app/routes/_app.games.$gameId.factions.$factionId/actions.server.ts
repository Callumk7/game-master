import { type SDK, duplicateFactionSchema } from "@repo/api";
import { redirect, typedjson } from "remix-typedjson";
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

export const deleteFaction = async (api: SDK, factionId: string) => {
	const result = await api.factions.delete(factionId);
	if (result.success) {
		return redirect("/games");
	}
	return typedjson(result);
};
