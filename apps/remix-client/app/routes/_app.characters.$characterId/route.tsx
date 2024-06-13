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
	handleDeleteCharacter,
	handleForwardUpdateCharacterRequest,
	handleUpdateCharacterBio,
} from "./components/queries.server";
import { UpdateCharacterBioSchema } from "../_app.characters.$characterId._index/character-bio-view";

// This is for updating stuff, like name and bio.
export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	const characterId = extractParam("characterId", params);
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
