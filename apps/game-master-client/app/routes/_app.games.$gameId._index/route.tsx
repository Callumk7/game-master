import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { api } from "~/lib/api.server";
import { EditorBody } from "~/components/editor";
import { validateUser } from "~/lib/auth.server";
import { EditableText } from "~/components/editable-text";

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const { gameId } = parseParams(params, { gameId: z.string() });
	const game = await api.games.getGame(gameId);
	const notes = await api.notes.getAllGameNotes(gameId);

	return typedjson({ game, notes });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
	const userId = await validateUser(request);
	const { gameId } = parseParams(params, {
		gameId: z.string(),
	});

	if (request.method === "PATCH") {
		const { name } = await parseForm(request, {
			name: z.string(),
		});

		const result = await api.games.updateGameDetails(gameId, { name });

		if (!result.success) {
			return new Response("Error");
		}

		return typedjson(result.data);
	}

	return new Response("Method Not Allowed", { status: 400 });
};

export default function GameRoute() {
	const { game } = useTypedLoaderData<typeof loader>();
	return (
		<div className="p-4">
			<EditableText
				method="patch"
				fieldName={"name"}
				value={game.name}
				inputClassName={"text-5xl font-bold mb-5 w-full focus:outline-none bg-inherit"}
				buttonClassName={"text-5xl font-bold w-full mb-5 text-left"}
				inputLabel={"Game name input"}
				buttonLabel={"Edit game name"}
			/>
		</div>
	);
}
