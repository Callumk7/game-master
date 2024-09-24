import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
	redirect,
	typedjson,
	useTypedLoaderData,
	useTypedRouteLoaderData,
} from "remix-typedjson";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { EditorBody } from "~/components/editor";
import { Text } from "~/components/ui/typeography";
import { api } from "~/lib/api.server";
import { NoteToolbar } from "./components/note-toolbar";
import { NoteSidebar } from "./components/note-sidebar";
import { OptionalEntitySchema } from "types/schemas";
import { stringOrArrayToArray } from "callum-util";

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const { noteId } = parseParams(params, {
		noteId: z.string(),
	});

	const note = await api.notes.getNote(noteId);
	const linkedNotes = await api.notes.getLinkedNotes(noteId);
	const linkedChars = await api.notes.getLinkedCharacters(noteId);
	const linkedFactions = await api.notes.getLinkedFactions(noteId);

	return typedjson({ note, linkedNotes, linkedChars, linkedFactions });
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

	if (request.method === "PUT") {
		const data = await parseForm(request, {
			characterIds: OptionalEntitySchema,
			factionIds: OptionalEntitySchema,
		});

		if (data.factionIds) {
			await api.notes.updateLinkedFactions(noteId, stringOrArrayToArray(data.factionIds));
		}
		if (data.characterIds) {
			await api.notes.updateLinkedCharacters(
				noteId,
				stringOrArrayToArray(data.characterIds),
			);
		}

		return null;
	}

	if (request.method === "DELETE") {
		const result = await api.notes.deleteNote(noteId);
		if (!result.success) {
			return new Response("Error");
		}
		return redirect("/");
	}

	return new Response("Method Not Allowed", { status: 400 });
};

export default function NotesRoute() {
	const { note } = useTypedLoaderData<typeof loader>();

	return (
		<>
			<div className="p-4 space-y-4">
				<NoteToolbar noteId={note.id} />
				<Text variant={"h2"}>{note.name}</Text>
				<EditorBody htmlContent={note.htmlContent} />
			</div>
			<NoteSidebar />
		</>
	);
}

export function useNoteData() {
	const data = useTypedRouteLoaderData<typeof loader>(
		"routes/_app.games.$gameId.notes.$noteId",
	);
	if (data === undefined) {
		throw new Error(
			"useNoteData must be used within the _app.games.$gameId.notes.$noteId route or its children",
		);
	}
	return data;
}
