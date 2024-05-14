import { ActionFunctionArgs, json, redirect } from "@remix-run/cloudflare";
import { validateUser } from "~/lib/auth";
import { NewNoteView } from "./new-note-view";
import { post } from "~/lib/game-master";

export const action = async ({ request, context }: ActionFunctionArgs) => {
	const userId = await validateUser(request);
	const form = await request.formData();
	form.append("userId", userId);

  const res = await post(context, "notes", form);
  return json(await res.json());
};

export { NewNoteView as default };
