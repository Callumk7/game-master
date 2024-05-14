import { ActionFunctionArgs, json, redirect } from "@remix-run/cloudflare";
import { validateUser } from "~/lib/auth";
import { NewNoteView } from "./new-note-view";
import ky from "ky";

export const action = async ({ request, context }: ActionFunctionArgs) => {
	const userId = await validateUser(request);
	const form = await request.formData();
	form.append("userId", userId);

	const res = await ky.post(`${context.cloudflare.env.GAME_MASTER_URL}/notes`, {
		body: form,
	});

	return json("cool");
};

export { NewNoteView as default };
