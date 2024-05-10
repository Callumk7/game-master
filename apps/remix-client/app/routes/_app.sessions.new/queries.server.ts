import { AppLoadContext, redirect } from "@remix-run/cloudflare";
import { sessionSelectSchema } from "@repo/db";
import ky from "ky";
import { ZodError } from "zod";
import { validateUser } from "~/lib/auth";

export const handleCreateSession = async (request: Request, context: AppLoadContext) => {
	const userId = await validateUser(request);
	const form = await request.formData();
	form.append("userId", userId);
	const json = await ky
		.post(`${context.cloudflare.env.GAME_MASTER_URL}/sessions`, { body: form })
		.json();

	try {
		const newSession = sessionSelectSchema.parse(json);
		return redirect(`/sessions/${newSession.id}`);
	} catch (error) {
		if (error instanceof ZodError) {
			console.error(error.errors);
		}
	}
	return json;
};
