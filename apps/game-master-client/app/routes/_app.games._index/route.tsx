import type { ActionFunctionArgs } from "@remix-run/node";
import { Form, json, useActionData } from "@remix-run/react";
import type { CreateGameRequestBody } from "@repo/api";
import { Button } from "~/components/ui/button";
import { FieldError, Label } from "~/components/ui/field";
import { Input, TextField } from "~/components/ui/textfield";
import { api, extractDataFromResponseOrThrow } from "~/lib/api.server";
import { validateUser } from "~/lib/auth.server";

// TODO: This is a skeleton route, come back to this

export const action = async ({ request }: ActionFunctionArgs) => {
	const userId = await validateUser(request);

	const form = await request.formData();
	const name = form.get("name")?.toString();

	const input: CreateGameRequestBody = {
		name: name!,
		ownerId: userId,
	};

	const result = await api.games.createGame(input);
	const newGame = extractDataFromResponseOrThrow(result);

	return json({ newGame });
};

export default function GamesIndex() {
	const data = useActionData<typeof action>();
	return (
		<div>
			{data?.newGame ? "true succeess" : "Nothing, or no success"}
			<Form method="post" action="/games?index" className="max-w-80 flex flex-col gap-4">
				<TextField name="name" type="text" isRequired>
					<Label>New Game</Label>
					<Input />
					<FieldError />
				</TextField>
				<Button className="w-fit" type="submit">
					Submit
				</Button>
			</Form>
		</div>
	);
}
