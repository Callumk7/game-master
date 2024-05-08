import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/cloudflare";
import { useTypedRouteLoaderData } from "remix-typedjson";
import { z } from "zod";
import { zx } from "zodix";
import { CharacterView } from "./character-view";
import { characersSelectSchema } from "@repo/db";

export const loader = async ({ params, context }: LoaderFunctionArgs) => {
	const { characterId } = zx.parseParams(params, { characterId: z.string() });
	const characterData = characersSelectSchema.parse(
		await fetch(`http://localhost:8787/characters/${characterId}`, {
			method: "GET",
		}).then((res) => res.json()),
	);

	return json({ characterData });
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
