import type { SDK } from "@repo/api";
import { z } from "zod";
import { parseForm } from "zodix";

export const unlinkCharacter = async (request: Request, api: SDK, factionId: string) => {
	const { characterId } = await parseForm(request, { characterId: z.string() });
	const result = await api.characters.factions.unlink(characterId, factionId);
	return result;
};

export const linkCharacter = async (request: Request, api: SDK, factionId: string) => {
	const { characterId } = await parseForm(request, { characterId: z.string() });
	const result = await api.characters.factions.link(characterId, [factionId]);
	return result;
};
