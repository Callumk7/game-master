import type { ActionFunctionArgs } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { Button, Form, Input } from "react-aria-components";
import type { CreateGameInput } from "types/games";
import { api } from "~/lib/api";
import { validateUser } from "~/lib/auth.server";

// TODO: This is a skeleton route, come back to this

export const action = async ({ request }: ActionFunctionArgs) => {
	const userId = await validateUser(request);

	const form = await request.formData();
	const name = form.get("name")?.toString();

	const input: CreateGameInput = {
		name: name!,
		ownerId: userId,
	};

	const result = await api.games.createGame(input);

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
