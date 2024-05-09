import { json } from "@remix-run/cloudflare";
import {
	DB,
	Faction,
	INTENT,
	badRequest,
	getAllUserCharacters,
	getFaction,
	updateFaction,
} from "@repo/db";
import { redirect, typedjson } from "remix-typedjson";
import { z } from "zod";
import { zx } from "zodix";
import { getIntentOrThrow } from "~/lib/responses";

export const handleFactionLoader = async (db: DB, userId: string, factionId: string) => {
	const faction = await getFaction(db, factionId);

	if (!faction) {
		return redirect("/factions");
	}

	const allCharacters = await getAllUserCharacters(db, userId);
	return typedjson({ faction, allCharacters });
};

export const handleUpdateFaction = async (
	db: DB,
	factionId: string,
	request: Request,
) => {
	const intent = await getIntentOrThrow(request);
	let update: Faction;
	switch (intent) {
		case INTENT.UPDATE_NAME: {
			const { name } = await zx.parseForm(request, { name: z.string() });
			update = await updateFaction(db, { name }, factionId);
			break;
		}

		default:
			throw badRequest("Invalid intent");
	}

	return json({ faction: update });
};
