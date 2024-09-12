import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { z } from "zod";
import { parseFormSafe, zx } from "zodix";
import { Text } from "~/ui/typeography";
import { api } from "~/lib/api.server";
import { EditorBody } from "~/components/editor";

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const { gameId } = zx.parseParams(params, { gameId: z.string() });
	const game = await api.games.getGame(gameId);
	const notes = await api.notes.getAllGameNotes(gameId);

	return typedjson({ game, notes });
};

export const action = async ({request, params, context}: ActionFunctionArgs) => {
  const form = await request.formData();
  console.log(form);
  return null;
}

export default function GameRoute() {
	const { game } = useTypedLoaderData<typeof loader>();
	return (
		<div>
			<EditorBody htmlContent="<p>A new note...</p>" />
		</div>
	);
}
