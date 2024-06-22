import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { redirect, typedjson, useTypedRouteLoaderData } from "remix-typedjson";
import { z } from "zod";
import { zx } from "zodix";
import { CharacterView, UpdateCharacterNameSchema } from "./character-view";
import {
	INTENT,
	createDrizzleForTurso,
	getFullCharacterData,
	methodNotAllowed,
} from "@repo/db";
import { extractParam } from "~/lib/zx-util";
import {
	handleBulkLinkToCharacter,
	handleDeleteCharacter,
	handleForwardUpdateCharacterRequest,
	handleUpdateCharacterBio,
} from "./queries.server";
import { UpdateCharacterBioSchema } from "../_app.characters.$characterId._index/character-bio-view";
import ky from "ky";

// This is for updating stuff, like name and bio.
export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	const characterId = extractParam("characterId", params);
	// Handle link entities to this character
	if (request.method === "PUT") {
		return await handleBulkLinkToCharacter(request, context, characterId);
	}
	// Handle delete character
	if (request.method === "DELETE") {
		return await handleDeleteCharacter(context, characterId, request);
	}
	// Handle update character bio - should be be updated to handle intent, and other
	// forms of character update
	if (request.method === "PATCH") {
		const submission = await zx.parseForm(
			request,
			z.discriminatedUnion("intent", [
				UpdateCharacterNameSchema,
				UpdateCharacterBioSchema,
			]),
		);
		// The form for the body in the editor needs to be updated (see handleUpdateCharacterBio)
		if (submission.intent === INTENT.UPDATE_BIO) {
			return await handleUpdateCharacterBio(context, characterId, request);
		}
		// Server handles all other updates
		return await handleForwardUpdateCharacterRequest(context, characterId, request);
	}
	if (request.method === "POST") {
		const data = (await request.json()) as { characterName: string };
		const messages = [
			{
				role: "system",
				content:
					"You are a tool that generates character bios for Dungeons and Dragons. The Setting is Eberron. You should return ONLY a HTML document body representing a 250 character description and bio for the provided character. If the character is recognised as an established character in the campaign setting, you should lean on this knowledge, however any context provided by the user should take presidence over any established setting information. You should add flare and excitement where necessery, and you should provide details in the bio that are provided via the user. The user will provide context through relations with the character that you are working on. These may include factions that they are a member of, or other characters. If provided, these other entities will come with bios that you can use to draw inspiration from",
			},
			{
				role: "user",
				content: `Character Name: ${data.characterName}`,
			},
			{
				role: "user",
				content: "Faction: Order of the Emerald Claw - Leader",
			},
			{
				role: "user",
				content: "Enemy: The Lord of Blades",
			},
		];
		const q = JSON.stringify(messages);
		const res = await ky.post(`http://localhost:9797?q=${q}`, { timeout: false });
		const json = await res.json();
		console.log(json);
		return null;
	}
	return methodNotAllowed();
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
