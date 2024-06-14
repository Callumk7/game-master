import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { methodNotAllowed, noContent } from "@repo/db";
import { postDelete } from "~/lib/game-master";
import { extractParam } from "~/lib/zx-util";

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	if (request.method === "DELETE") {
		// Handle the unlinking of notes to the character, will probably include some other stuff

		const characterId = extractParam("characterId", params);
		const form = await request.formData();
		const res = await postDelete(context, `characters/${characterId}/links`, form);
		return noContent();
	}
	return methodNotAllowed();
};

export default function CharacterLinksRoute() {
	return (
		<div className="w-full h-screen relative">
			<p>Under Construction</p>
		</div>
	);
}
