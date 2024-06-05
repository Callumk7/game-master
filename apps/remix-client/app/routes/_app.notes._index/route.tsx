import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { typedjson } from "remix-typedjson";
import { getUserId, getUserSession } from "~/lib/auth";
import NotesView from "./notes-index-view";
import { createDrizzleForTurso, getAllNotesWithRelations } from "@repo/db";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
	const session = await getUserSession(request);
	const userId = getUserId(session);
	const db = createDrizzleForTurso(context.cloudflare.env);

	const allNotes = await getAllNotesWithRelations(db, userId);
	return typedjson({ allNotes });
};

export { NotesView as default };
