import { AppLoadContext } from "@remix-run/cloudflare";
import ky from "ky";
import { validateUser } from "~/lib/auth";

export const handleCreateSession = async (request: Request, context: AppLoadContext) => {
	const userId = await validateUser(request);
	const form = await request.formData();
	form.append("userId", userId);
	const json = await ky
		.post(`${context.cloudflare.env.GAME_MASTER_URL}/sessions`, { body: form })
		.json();
	return json;
};
