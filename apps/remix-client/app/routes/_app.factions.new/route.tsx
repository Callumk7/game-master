import { ActionFunctionArgs, json, redirect } from "@remix-run/cloudflare";
import { BasicEntity } from "@repo/db";
import { validateUser } from "~/lib/auth";
import { post } from "~/lib/game-master";

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	const userId = await validateUser(request);
	const form = await request.formData();
	form.append("userId", userId);

	const res = (await post(context, "factions", form).then((res) =>
		res.json(),
	)) as BasicEntity;
	return redirect(`/factions/${res.id}`);
};
