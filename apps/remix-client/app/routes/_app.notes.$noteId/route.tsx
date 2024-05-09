import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/cloudflare";
import {
	IntentSchema,
	UpdateNoteRequest,
	createDrizzleForTurso,
	getNoteAndLinkedEntities,
	getUserFolders,
	internalServerError,
	updateNoteSchema,
} from "@repo/db";
import { typedjson, redirect, useTypedRouteLoaderData } from "remix-typedjson";
import { z } from "zod";
import { zx } from "zodix";
import { validateUser } from "~/lib/auth";
import NoteView from "./note-view";
import { StatusCodes } from "http-status-codes";

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	const { noteId } = zx.parseParams(params, { noteId: z.string() });
	const { intent, name, htmlContent } = await zx.parseForm(
		request,
		updateNoteSchema.omit({ noteId: true }),
	);
	const noteUpdate: UpdateNoteRequest = {
		noteId,
		intent,
		name,
		htmlContent,
	};

	const fetchResult = await fetch(
		`${context.cloudflare.env.GAME_MASTER_URL}/notes/${noteId}`,
		{
			method: "PATCH",
			body: JSON.stringify(noteUpdate),
		},
	);

	console.log(fetchResult.status);

	if (fetchResult.status === StatusCodes.NO_CONTENT) {
		return json({ success: true });
	}

	return internalServerError();
};

export const loader = async ({ request, params, context }: LoaderFunctionArgs) => {
	const { noteId } = zx.parseParams(params, { noteId: z.string() });
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
