import { NotePage } from "~/components/notes-page";
import { useFactionRouteData } from "../_app.factions.$factionId/route";
import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { validateUser } from "~/lib/auth";
import { zx } from "zodix";
import { z } from "zod";
import { createNoteAndLinkToFaction, linkNotesToFaction } from "./queries.server";
import { methodNotAllowed } from "@repo/db";

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	const userId = await validateUser(request);
	const { factionId } = zx.parseParams(params, { factionId: z.string() });
	if (request.method === "POST") {
		return await createNoteAndLinkToFaction(request, context, userId, factionId);
	}
	if (request.method === "PUT") {
		return await linkNotesToFaction(request, context, factionId);
	}
	return methodNotAllowed();
};

export default function FactionNotesRoute() {
	const { faction } = useFactionRouteData();
	const factionNotes = faction.notes.map((n) => n.note);
	return (
		<NotePage
			entityId={faction.id}
			entityType="factions"
			notes={factionNotes}
			action=""
			linkAction=""
		/>
	);
}
