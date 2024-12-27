import { type SDK, updateCharacterSchema } from "@repo/api";
import { parseForm } from "zodix";
import { successRedirect } from "~/lib/navigation";
import { numberToStrings } from "./create-character.server";

export const updateCharacter = async (request: Request, api: SDK, charId: string) => {
	const data = await parseForm(request, updateCharacterSchema.merge(numberToStrings));
	const result = await api.characters.update(charId, data);
	return result;
};

export const deleteCharacter = async (api: SDK, charId: string, gameId: string) => {
	const result = await api.characters.delete(charId);
	if (result.success) {
		return successRedirect({
			path: `/games/${gameId}`,
			message: "Successfully deleted character",
		});
	}
	return result;
};
