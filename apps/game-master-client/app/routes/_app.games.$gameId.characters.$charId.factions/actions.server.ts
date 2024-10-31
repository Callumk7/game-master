import type { SDK } from "@repo/api";
import { typedjson } from "remix-typedjson";
import { z } from "zod";
import { parseForm } from "zodix";

export const updateCharacterFaction = async (
	request: Request,
	api: SDK,
	charId: string,
) => {
	const { factionId, isPrimary } = await parseForm(request, {
		factionId: z.string(),
		isPrimary: z.string().optional(),
	});
	if (isPrimary) {
		await api.characters.updateCharacterDetails(charId, {
			primaryFactionId: factionId,
		});
	}
	const result = await api.characters.linkFactions(charId, [factionId]);
	return typedjson(result);
};

export const unlinkFaction = async (request: Request, api: SDK, charId: string) => {
	const { factionId } = await parseForm(request, {
		factionId: z.string(),
	});
	const result = await api.characters.unlinkFaction(charId, factionId);
	return typedjson(result);
};

