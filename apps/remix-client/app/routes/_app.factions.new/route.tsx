import { ActionFunctionArgs } from "@remix-run/cloudflare";
import ky from "ky";
import { validateUser } from "~/lib/auth";

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	const userId = await validateUser(request);
	const form = await request.formData();
	form.append("userId", userId);

	const res = await ky.post(`${context.cloudflare.env.GAME_MASTER_URL}/factions`, {
		body: form,
	});
	return null;
};
