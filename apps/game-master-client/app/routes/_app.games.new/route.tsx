import type { ActionFunctionArgs } from "@remix-run/node";
import { Form, json, redirect } from "@remix-run/react";
import type { CreateGameRequestBody } from "@repo/api";
import { z } from "zod";
import { parseForm } from "zodix";
import { Button } from "~/components/ui/button";
import { JollyTextField } from "~/components/ui/textfield";
import { api, extractDataFromResponseOrThrow } from "~/lib/api.server";
import { validateUser } from "~/lib/auth.server";

export const action = async ({ request }: ActionFunctionArgs) => {
	const userId = await validateUser(request);

	const { name } = await parseForm(request, { name: z.string() });

	const input: CreateGameRequestBody = {
		name: name,
		ownerId: userId,
	};

	const result = await api.games.createGame(input);
	const newGame = extractDataFromResponseOrThrow(result);

	return redirect(`/games/${newGame.id}`);
};

export default function NewGameRoute() {
	return (
		<div className="p-6">
			<Form method="post" className="max-w-80 flex flex-col gap-4">
				<JollyTextField type="text" label="Name" name="name" isRequired />
				<Button className="w-fit" type="submit">
					Submit
				</Button>
			</Form>
		</div>
	);
}
