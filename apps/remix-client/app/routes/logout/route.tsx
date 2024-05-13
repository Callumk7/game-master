import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { redirect } from "remix-typedjson";
import { destroySession, getUserSession } from "~/lib/auth";

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	const session = await getUserSession(request);
	return redirect("/", {
		headers: {
			"Set-Cookie": await destroySession(session),
		},
	});
};
