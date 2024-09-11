import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { EditorBody } from "~/components/editor";
import { Text } from "~/components/ui/typeography";
import { api } from "~/lib/api.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const { noteId } = parseParams(params, {
		noteId: z.string(),
	});

	const note = await api.notes.getNote(noteId);
	return typedjson({ note });
};

// Update note
export const action = async ({ request, params }: ActionFunctionArgs) => {
	const { noteId } = parseParams(params, {
		noteId: z.string(),
	});

	if (request.method === "PATCH") {
		const data = await parseForm(request, {
			content: z.string(),
			htmlContent: z.string(),
		});
		const result = await api.notes.updateNote(noteId, data);

		if (!result.success) {
			return new Response("Error");
		}

		return typedjson(result.data);
	}

	return new Response("Method Not Allowed", { status: 400 });
};

export default function NotesRoute() {
	const { gameId, noteId } = useParams();
	const { note } = useTypedLoaderData<typeof loader>();
	return (
		<div className="p-4 space-y-4">
			<Text variant={"h1"}>{noteId}</Text>
			<Text variant={"h2"}>{gameId}</Text>
			<EditorBody htmlContent={note.htmlContent} />
		</div>
	);
}
