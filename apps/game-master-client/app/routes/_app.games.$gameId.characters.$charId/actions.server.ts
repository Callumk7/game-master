import { redirect } from "@remix-run/node";
import { type SDK, duplicateCharacterSchema } from "@repo/api";
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

	const dupeResult = await api.characters.duplicate(charId, {
		...data,
		ownerId: userId,
	});

	if (!dupeResult.success) {
		return unsuccessfulResponse(dupeResult.message);
	}

	const { gameId, id } = dupeResult.data;
	return redirect(characterHref(gameId, id));
};
