import { NotePage } from "~/components/notes-page";
import { useCharacterRouteData } from "../_app.characters.$characterId/route";
import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { zx } from "zodix";
import { z } from "zod";
import { createNoteAndLinkToCharacter, linkNotesToCharacter } from "./queries.server";
import { methodNotAllowed } from "@repo/db";
import { validateUser } from "~/lib/auth";

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	const userId = await validateUser(request);
	const { characterId } = zx.parseParams(params, { characterId: z.string() });
	if (request.method === "POST") {
		return await createNoteAndLinkToCharacter(request, context, userId, characterId);
	}
	if (request.method === "PUT") {
		return await linkNotesToCharacter(request, context, characterId);
	}
	return methodNotAllowed();
};

export default function CharacterNotesView() {
	const { characterData } = useCharacterRouteData();
	const characterNotes = characterData.notes.map((n) => n.note);
	return (
		<NotePage
			entityId={characterData.id}
			entityType="characters"
			notes={characterNotes}
			action=""
			linkAction=""
		/>
	);
}
