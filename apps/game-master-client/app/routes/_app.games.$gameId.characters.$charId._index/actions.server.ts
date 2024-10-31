import { type SDK, updateCharacterSchema } from "@repo/api";
import { typedjson } from "remix-typedjson";
import { z } from "zod";
import { parseForm } from "zodix";

export const updateCharacter = async (request: Request, api: SDK, charId: string) => {
	const data = await parseForm(request, updateCharacterSchema);
	const result = await api.characters.updateCharacterDetails(charId, data);
	return typedjson(result);
};

export const linkNoteToCharacter = async (request: Request, api: SDK, charId: string) => {
	const { noteId } = await parseForm(request, { noteId: z.string() });
	const result = await api.characters.linkNotes(charId, [noteId]);
	return typedjson(result);
};
