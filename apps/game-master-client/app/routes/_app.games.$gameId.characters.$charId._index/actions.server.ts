import { type SDK, updateCharacterSchema } from "@repo/api";
import { typedjson } from "remix-typedjson";
import { parseForm } from "zodix";

export const updateCharacter = async (request: Request, api: SDK, charId: string) => {
	const data = await parseForm(request, updateCharacterSchema);
	const result = await api.characters.update(charId, data);
	return typedjson(result);
};

export const updateLinkedNotes = async (request: Request, api: SDK, charId: string) => {
	const data = (await request.json()) as { noteIds: string[] };
	const result = await api.characters.links.set.notes(charId, data.noteIds);
	return typedjson(result);
};
