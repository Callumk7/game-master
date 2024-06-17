import type { AppLoadContext } from "@remix-run/cloudflare";
import { LINK_INTENT } from "@repo/db";
import { put } from "~/lib/game-master";

export const bulkUpdateMembers = async (
	request: Request,
	context: AppLoadContext,
	factionId: string,
) => {
	const form = await request.formData();
	const memberIds = form.getAll("memberIds");
	memberIds.forEach((id) => form.append("linkIds", id.toString()));
	form.append("intent", LINK_INTENT.CHARACTERS);
	const res = await put(context, `factions/${factionId}/links`, form);
};
