import { type AppLoadContext, json } from "@remix-run/cloudflare";
import { type DB, getFaction } from "@repo/db";
import { redirect, typedjson } from "remix-typedjson";
import { patch } from "~/lib/game-master";

export const handleFactionLoader = async (db: DB, factionId: string) => {
	const faction = await getFaction(db, factionId);

	if (!faction) {
		return redirect("/factions");
	}

	return typedjson({ faction });
};

export const handleUpdateFaction = async (
	request: Request,
	context: AppLoadContext,
	factionId: string,
) => {
	const form = await request.formData();
	const htmlContent = form.get("htmlContent");

	// the sync editor hook uses this field, as it is more common accross
	// all other entities. could handle there or here.
	if (htmlContent) {
		form.append("description", htmlContent);
	}
	await patch(context, `factions/${factionId}`, form);

	return json({ faction: factionId });
};
