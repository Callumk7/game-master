import { type ActionFunctionArgs, redirect } from "@remix-run/cloudflare";
import { validateUser } from "~/lib/auth";
import { NewNoteView } from "./new-note-view";
import { post } from "~/lib/game-master";
import type { BasicEntity } from "@repo/db";

export const action = async ({ request, context }: ActionFunctionArgs) => {
	const userId = await validateUser(request);
	const form = await request.formData();
	form.append("userId", userId);

	const res = (await post(context, "notes", form).then((result) =>
		result.json(),
	)) as BasicEntity;
	return redirect(`/notes/${res.id}`);
};

export { NewNoteView as default };
