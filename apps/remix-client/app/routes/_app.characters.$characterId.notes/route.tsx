import { NotePage } from "~/components/notes-page";
import { useCharacterRouteData } from "../_app.characters.$characterId/route";
import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { validateUser } from "~/lib/auth";
import { zx } from "zodix";
import { z } from "zod";
import { GameMaster } from "~/lib/game-master";
import { LINK_INTENT } from "@repo/db";

// formData shape...
export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	const userId = await validateUser(request);
	const { characterId } = zx.parseParams(params, { characterId: z.string() });
	const form = await request.formData();
	form.append("userId", userId);
	form.append("links", "true");
	form.append("intent", LINK_INTENT.CHARACTERS);
	form.append("linkIds", characterId);
	const gameMaster = GameMaster.create(context);
	const res = await gameMaster.post("notes", form);
	return await res.json();
};

export default function CharacterNotesView() {
	const { characterData } = useCharacterRouteData();
	const characterNotes = characterData.notes.map((n) => n.note);
	return (
		<NotePage
			entityId={characterData.id}
			entityType="characters"
			notes={characterNotes}
			action={`/characters/${characterData.id}/notes`}
		/>
	);
}
