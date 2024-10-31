import type { SDK } from "@repo/api";
import { typedjson } from "remix-typedjson";
import { z } from "zod";
import { parseForm } from "zodix";

export const unlinkCharacter = async (request: Request, api: SDK, factionId: string) => {
	const { characterId } = await parseForm(request, { characterId: z.string() });
	const result = api.characters.unlinkFaction(characterId, factionId);
	return typedjson(result);
};
