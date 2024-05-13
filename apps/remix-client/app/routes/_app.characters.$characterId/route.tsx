import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { redirect, typedjson, useTypedRouteLoaderData } from "remix-typedjson";
import { z } from "zod";
import { zx } from "zodix";
import { CharacterView } from "./character-view";
import { createDrizzleForTurso, getFullCharacterData } from "@repo/db";

// export const action = async ({ request, params, context }: ActionFunctionArgs) => {
// 	const userId = await validateUser(request);
//
// 	const { name, description } = await zx.parseForm(
// 		request,
// 		createFactionRequest.omit({ userId: true }),
// 	);
//
// 	// I am testing making a new faction within the action for the character
// 	const { characterId } = zx.parseParams(params, { characterId: z.string() });
//
// 	const url = new URL("http://localhost:8787/factions");
// 	const linkParams = { link: characterId, linkType: "characters" };
// 	url.search = new URLSearchParams(linkParams).toString();
//
// 	const factionInsert = {
// 		userId,
// 		name,
// 		description,
// 	};
//
// 	console.log(factionInsert);
//
// 	const newReq = new Request(url, {
// 		method: "POST",
// 		body: JSON.stringify(factionInsert),
// 		headers: {
// 			"Content-Type": "application-json",
// 		},
// 	});
// 	const newFaction = await fetch(newReq);
// 	return null;
// };
//
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
