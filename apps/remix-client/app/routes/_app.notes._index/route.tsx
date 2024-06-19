import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { typedjson } from "remix-typedjson";
import { getUserId, getUserSession } from "~/lib/auth";
import NotesIndexView from "./notes-index-view";
import { createDrizzleForTurso, getAllNotesWithRelations } from "@repo/db";
import { postDelete } from "~/lib/game-master";
import { extractParam } from "~/lib/zx-util";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
	const session = await getUserSession(request);
	const userId = getUserId(session);
	const db = createDrizzleForTurso(context.cloudflare.env);

	const allNotes = await getAllNotesWithRelations(db, userId);
	return typedjson({ allNotes });
};

// TODO: Complete this route
export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	const form = await request.formData();
	const res = await postDelete(context, "notes", form);
	return null;
};

export { NotesIndexView as default };
