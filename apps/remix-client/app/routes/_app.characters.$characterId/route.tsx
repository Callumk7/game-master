import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/cloudflare";
import { useTypedRouteLoaderData } from "remix-typedjson";
import { z } from "zod";
import { zx } from "zodix";
import { CharacterView } from "./character-view";
import {
	FactionInsert,
	characersSelectSchema,
	createFactionRequest,
	factionSelectSchema,
} from "@repo/db";
import { validateUser } from "~/lib/auth";

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	const userId = await validateUser(request);

	const { name, description } = await zx.parseForm(
		request,
		createFactionRequest.omit({ userId: true }),
	);

	// I am testing making a new faction within the action for the character
	const { characterId } = zx.parseParams(params, { characterId: z.string() });

	const url = new URL("http://localhost:8787/factions");
	const linkParams = { link: characterId, linkType: "characters" };
	url.search = new URLSearchParams(linkParams).toString();

	const factionInsert = {
		userId,
		name,
		description,
	};

	console.log(factionInsert);

	const newReq = new Request(url, {
		method: "POST",
		body: JSON.stringify(factionInsert),
		headers: {
			"Content-Type": "application-json",
		},
	});
	const newFaction = await fetch(newReq);
	return null;
};

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
