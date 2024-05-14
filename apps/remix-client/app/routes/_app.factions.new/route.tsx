import { ActionFunctionArgs, json } from "@remix-run/cloudflare";
import { validateUser } from "~/lib/auth";
import { post } from "~/lib/game-master";

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	const userId = await validateUser(request);
	const form = await request.formData();
	form.append("userId", userId);

  const res = await post(context, "factions", form);
  return json(await res.json());
};
