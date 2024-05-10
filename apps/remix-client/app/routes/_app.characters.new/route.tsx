import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { MainContainer } from "~/components/layout";
import { zx } from "zodix";
import { createCharacterRequest } from "@repo/db";
import { validateUser } from "~/lib/auth";
import { NewCharacterForm } from "~/components/forms/new-character";

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	const userId = await validateUser(request);
	const parsedForm = await zx.parseForm(
		request,
		createCharacterRequest.omit({ userId: true }),
	);
	const newCharBody = JSON.stringify({ userId, ...parsedForm });
	const res = await fetch("http://localhost:8787/characters", {
		method: "POST",
		body: newCharBody,
		headers: {
			"Content-Type": "application/json",
		},
	});
	const responseJson = await res.json();
	console.log(responseJson);
	return null;
};

export default function NewCharacterRoute() {
	return (
		<MainContainer>
			<NewCharacterForm />
		</MainContainer>
	);
}
