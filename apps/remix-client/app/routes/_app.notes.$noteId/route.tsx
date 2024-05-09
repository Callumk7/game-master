import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import {
	createDrizzleForTurso,
	getNoteAndLinkedEntities,
	getUserFolders,
} from "@repo/db";
import { typedjson, redirect, useTypedRouteLoaderData } from "remix-typedjson";
import { z } from "zod";
import { zx } from "zodix";
import { validateUser } from "~/lib/auth";
import NoteView from "./note-view";

export const loader = async ({ request, params, context }: LoaderFunctionArgs) => {
	const { noteId } = zx.parseParams(params, { noteId: z.string() });
	const db = createDrizzleForTurso(context.cloudflare.env);

	const userId = await validateUser(request);

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
