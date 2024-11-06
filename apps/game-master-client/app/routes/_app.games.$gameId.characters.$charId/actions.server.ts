import {
	type SDK,
	duplicateCharacterSchema,
} from "@repo/api";
import { redirect, typedjson } from "remix-typedjson";
import { parseForm } from "zodix";
import { characterHref } from "~/util/generate-hrefs";
import { unsuccessfulResponse } from "~/util/responses";

export const duplicateCharacter = async (
	request: Request,
	api: SDK,
	charId: string,
	userId: string,
) => {
	const data = await parseForm(
		request,
		duplicateCharacterSchema.omit({ ownerId: true }),
	);

	const dupeResult = await api.characters.duplicateCharacter(charId, {
		...data,
		ownerId: userId,
	});

	if (!dupeResult.success) {
		return unsuccessfulResponse(dupeResult.message);
	}

	const { gameId, id } = dupeResult.data;
	return redirect(characterHref(gameId, id));
};

export const deleteCharacter = async (api: SDK, charId: string) => {
	const result = await api.characters.deleteCharacter(charId);
	if (result.success) {
		return redirect("/games");
	}
	return typedjson(result);
};
