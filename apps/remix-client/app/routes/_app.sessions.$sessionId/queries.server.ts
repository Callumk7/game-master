import { type AppLoadContext, json } from "@remix-run/cloudflare";
import { put } from "~/lib/game-master";

export const handleBulkLinkToSession = async (
	request: Request,
	context: AppLoadContext,
	sessionId: string,
) => {
	const form = await request.formData();
	console.log(form);
	const res = await put(context, `sessions/${sessionId}/links`, form);
	return json(await res.json());
};
