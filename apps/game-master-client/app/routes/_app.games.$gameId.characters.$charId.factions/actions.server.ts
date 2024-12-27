import type { SDK } from "@repo/api";
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
		await api.characters.update(charId, {
			primaryFactionId: factionId,
		});
	}
	const result = await api.characters.factions.link(charId, [factionId]);
	return result;
};

export const unlinkFaction = async (request: Request, api: SDK, charId: string) => {
	const { factionId } = await parseForm(request, {
		factionId: z.string(),
	});
	const result = await api.characters.factions.unlink(charId, factionId);
	return result;
};
