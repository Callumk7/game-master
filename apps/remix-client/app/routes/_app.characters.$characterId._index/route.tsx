import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { extractParam } from "~/lib/zx-util";
import { post } from "~/lib/game-master";
import { CharacterBioView } from "./character-bio-view";

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	// On the character page, we can add links to other entities, we do this
	// with a PUT request to the server, with the intent, and the required ids.
	// In the case of this specific route, that is ALWAYS a single id.
	if (request.method === "POST") {
		const characterId = extractParam("characterId", params);
		const form = await request.formData();
		const res = await post(context, `characters/${characterId}/links`, form);
		return res.clone();
	}
};

export { CharacterBioView as default };
