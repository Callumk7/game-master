import { type SDK, updateCharacterSchema } from "@repo/api";
import { typedjson } from "remix-typedjson";
import { z } from "zod";
import { parseForm, zx } from "zodix";

export const updateCharacter = async (request: Request, api: SDK, charId: string) => {
	const data = await parseForm(request, updateCharacterSchema.merge(numberToStrings));
	const result = await api.characters.updateCharacterDetails(charId, data);
	return typedjson(result);
};

export const numberToStrings = z.object({
	level: zx.NumAsString.optional(),
	strength: zx.NumAsString.optional(),
	dexterity: zx.NumAsString.optional(),
	constitution: zx.NumAsString.optional(),
	wisdom: zx.NumAsString.optional(),
	intelligence: zx.NumAsString.optional(),
	charisma: zx.NumAsString.optional(),
});
