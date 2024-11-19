import { json, redirect } from "@remix-run/react";
import { createCharacterSchema } from "@repo/api";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { z } from "zod";
import { parseForm, zx } from "zodix";
import { createApi } from "~/lib/api.server";
import { validateUser } from "~/lib/auth.server";

export async function createCharacterAction(request: Request) {
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
			return redirect(`/games/${gameId}/characters/${id}`);
		}
	} catch (error) {
		console.error(error);
	}

	return json(
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
