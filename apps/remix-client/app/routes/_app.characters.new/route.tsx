import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { Form } from "@remix-run/react";
import { MainContainer } from "~/components/layout";
import { Button } from "~/components/ui/button";
import { TextField } from "~/components/ui/text-field";
import { zx } from "zodix";
import { createCharacterRequest } from "@repo/db";
import { validateUser } from "~/lib/auth";

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

interface NewCharacterFormProps {
	action?: string;
}

export function NewCharacterForm({ action }: NewCharacterFormProps) {
	return (
		<Form className="flex flex-col gap-4 p-4" action={action} method="POST">
			<TextField name="name" label="Character Name" />
			<TextField textarea name="bio" label="Character Bio" />
			<TextField name="raceId" label="Race" />
			<Button type="submit">Submit</Button>
		</Form>
	);
}
