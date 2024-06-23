import type { AppLoadContext } from "@remix-run/cloudflare";
import { LINK_INTENT, noContent } from "@repo/db";
import { patch, put } from "~/lib/game-master";

export const handleBulkUpdateMembers = async (
	request: Request,
	context: AppLoadContext,
	factionId: string,
) => {
	const form = await request.formData();
	const res = await put(context, `factions/${factionId}/links`, form);
	return noContent();
};

export const handleUpdateMember = async (
	request: Request,
	context: AppLoadContext,
	factionId: string,
	characterId: string,
) => {
	const form = await request.formData();
	const res = await patch(
		context,
		`factions/${factionId}/members/${characterId}`,
		form,
	);
	return noContent();
};
