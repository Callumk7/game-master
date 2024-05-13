import { ActionFunctionArgs, json } from "@remix-run/cloudflare";
import { MainContainer } from "~/components/layout";
import { zx } from "zodix";
import { createCharacterRequest } from "@repo/db";
import { validateUser } from "~/lib/auth";
import { NewCharacterForm } from "~/components/forms/new-character";
import ky from "ky";

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	const userId = await validateUser(request);
	const form = await request.formData();
	form.append("userId", userId);

	const res = await ky.post(`${context.cloudflare.env.GAME_MASTER_URL}/characters`, {
		body: form,
	});
	return json({ character: await res.json() });
};

export default function NewCharacterRoute() {
	return (
		<MainContainer>
			<NewCharacterForm />
		</MainContainer>
	);
}
