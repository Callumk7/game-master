import type { ActionFunctionArgs } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { Button, Form, Input } from "react-aria-components";
import { SERVER_URL } from "~/config";
import { validateUser } from "~/lib/auth.server";

// TODO: This is a skeleton route, come back to this

export const action = async ({ request }: ActionFunctionArgs) => {
	const userId = await validateUser(request);

	const form = await request.formData();
	const name = form.get("name")?.toString();

	const res = await fetch(`${SERVER_URL}/games`, {
		method: "POST",
		body: JSON.stringify({
			name: name!,
			ownerId: userId,
		}),
	});

	if (!res.ok) {
		console.log(res.status);
		console.error("Something has gone wrong");
		return { newGame: false };
	}

	return { newGame: true };
};

export default function GamesIndex() {
	const data = useActionData<typeof action>();
	return (
		<div>
			{data?.newGame ? "true succeess" : "Nothing, or no success"}
			<Form method="post" action="/games?index">
				<Input name="name" />
				<Button type="submit">Create</Button>
			</Form>
		</div>
	);
}
