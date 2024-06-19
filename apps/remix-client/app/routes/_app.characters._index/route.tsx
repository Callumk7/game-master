import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { methodNotAllowed, type CharacterWithRaceAndFactions } from "@repo/db";
import { typedjson } from "remix-typedjson";
import { validateUser } from "~/lib/auth";
import { createApi, postDelete } from "~/lib/game-master";
import { CharacterIndexView } from "./character-index-view";

export const loader = async ({ request, params, context }: LoaderFunctionArgs) => {
	const userId = await validateUser(request);
	const api = createApi(context);
	const allCharacters = (await api
		.get("characters", {
			searchParams: new URLSearchParams([["userId", userId]]),
		})
		.json()) as CharacterWithRaceAndFactions[];
	return typedjson({ allCharacters });
};

// TODO: complete this route
export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	if (request.method === "DELETE") {
		const form = await request.formData();
		const res = await postDelete(context, "characters", form);
		return null;
	}
	return methodNotAllowed();
};

export { CharacterIndexView as default };
