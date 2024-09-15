import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect, useLoaderData, useParams } from "@remix-run/react";
import { createNoteSchema } from "@repo/api";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { api } from "~/lib/api.server";
import { validateUser } from "~/lib/auth.server";
import { NewNoteEditor } from "./components/new-note";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const userId = await validateUser(request);
	return json({ userId });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
	const { gameId } = parseParams(params, { gameId: z.string() });
	const data = await parseForm(request, createNoteSchema);

	const result = await api.notes.createNote(data);
  
	if (result.success) {
		return redirect(`/games/${gameId}/notes/${result.data.id}`);
	}

	return json({ error: result.message });
};

export default function NewNoteRoute() {
	const { userId } = useLoaderData<typeof loader>();
	const { gameId } = useParams();
	return (
		<div>
			<NewNoteEditor userId={userId} gameId={gameId!} />
		</div>
	);
}

