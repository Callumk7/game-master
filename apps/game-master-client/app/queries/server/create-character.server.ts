import { createCharacterSchema } from "@repo/api";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { typedjson } from "remix-typedjson";
import { z } from "zod";
import { parseForm, zx } from "zodix";
import { createApi } from "~/lib/api.server";
import { validateUser } from "~/lib/auth.server";
import { successRedirect } from "~/lib/navigation";

export async function createCharacterAction(request: Request, redirect?: string) {
	const userId = await validateUser(request);
	const api = createApi(userId);
	const data = await parseForm(
		request,
		createCharacterSchema.omit({ ownerId: true }).merge(numberToStrings),
	);
	try {
		const result = await api.characters.create({ ...data, ownerId: userId });
		if (result.success) {
			const { gameId, id } = result.data;
			return successRedirect({
				path: redirect ? redirect : `/games/${gameId}/characters/${id}`,
				message: "Character created successfully",
			});
		}
	} catch (error) {
		console.error(error);
	}

	return typedjson(
		{ errorMsg: "There was a problem creating this character, please try again." },
		{
			status: StatusCodes.INTERNAL_SERVER_ERROR,
			statusText: ReasonPhrases.INTERNAL_SERVER_ERROR,
		},
	);
}

export const numberToStrings = z.object({
	level: zx.NumAsString.optional(),
	strength: zx.NumAsString.optional(),
	dexterity: zx.NumAsString.optional(),
	constitution: zx.NumAsString.optional(),
	wisdom: zx.NumAsString.optional(),
	intelligence: zx.NumAsString.optional(),
	charisma: zx.NumAsString.optional(),
});
