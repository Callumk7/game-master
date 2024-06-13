import {
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	json,
} from "@remix-run/cloudflare";
import { redirect, typedjson, useTypedRouteLoaderData } from "remix-typedjson";
import { z } from "zod";
import { zx } from "zodix";
import { CharacterView } from "./character-view";
import { createDrizzleForTurso, getFullCharacterData, notes } from "@repo/db";
import { extractParam } from "~/lib/zx-util";
import { patch } from "~/lib/game-master";

// This is for updating stuff, like name and bio.
export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	const characterId = extractParam("characterId", params);
	const form = await request.formData();
	if (request.method === "PATCH") {
		const bio = String(form.get("htmlContent"));
		form.append("bio", bio);
		const res = await patch(context, `characters/${characterId}`, form);

		return json({ success: "sure" });
	}
};

export const loader = async ({ params, context }: LoaderFunctionArgs) => {
	const { characterId } = zx.parseParams(params, { characterId: z.string() });
	const db = createDrizzleForTurso(context.cloudflare.env);
	const characterData = await getFullCharacterData(db, characterId);

	if (!characterData) {
		return redirect("/characters");
	}

	return typedjson({ characterData });
};

export const useCharacterRouteData = () => {
	const data = useTypedRouteLoaderData<typeof loader>(
		"routes/_app.characters.$characterId",
	);
	if (data === undefined) {
		throw new Error(
			"useCharacterRouteData must be used within the _app.character.$characterId route or it's children",
		);
	}
	return data;
};

export { CharacterView as default };
