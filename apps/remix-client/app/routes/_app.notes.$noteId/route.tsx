import {
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	json,
} from "@remix-run/cloudflare";
import {
	createDrizzleForTurso,
	getNoteAndLinkedEntities,
	getUserFolders,
	handleDeleteNote,
	methodNotAllowed,
} from "@repo/db";
import { typedjson, redirect, useTypedRouteLoaderData } from "remix-typedjson";
import { validateUser } from "~/lib/auth";
import NoteView from "./note-view";
import { extractParam } from "~/lib/zx-util";
import { patch } from "~/lib/game-master";
import { handleBulkLinkToNote, handleLinkNoteToFolder } from "./queries.server";

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	const userId = await validateUser(request);
	const noteId = extractParam("noteId", params);

	// Handle linking entities to note
	if (request.method === "PUT") {
		return await handleBulkLinkToNote(request, context, noteId);
	}

	// Handle folder requests
	if (request.method === "POST") {
		return await handleLinkNoteToFolder(request, context, userId, noteId);
	}

	// Handle updating the note itself
	if (request.method === "PATCH") {
		const form = await request.formData();
		await patch(context, `notes/${noteId}`, form);
		return json({ noteId, success: true });
	}

	if (request.method === "DELETE") {
		const db = createDrizzleForTurso(context.cloudflare.env);
		return await handleDeleteNote(db, noteId);
	}
	return methodNotAllowed();
};

export const loader = async ({ request, params, context }: LoaderFunctionArgs) => {
	const noteId = extractParam("noteId", params);
	const userId = await validateUser(request);

	const db = createDrizzleForTurso(context.cloudflare.env);

	const noteData = await getNoteAndLinkedEntities(db, noteId);
	const allUserFolders = await getUserFolders(db, userId);

	if (!noteData) {
		return redirect("/notes");
	}

	return typedjson({ noteData, folders: allUserFolders });
};

// Custom hook for using note data lower down in the tree
export function useNoteIdLoaderData() {
	const data = useTypedRouteLoaderData<typeof loader>("routes/_app.notes.$noteId");
	if (data === undefined) {
		throw new Error(
			"useNoteIdLoaderData must be used within the _app.notes.$noteId route or its children",
		);
	}
	return data;
}

export { NoteView as default };
