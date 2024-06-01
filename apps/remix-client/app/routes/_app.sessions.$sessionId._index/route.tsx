import { useSessionRouteData } from "../_app.sessions.$sessionId/route";
import { json, type ActionFunctionArgs } from "@remix-run/cloudflare";
import { extractParam } from "~/lib/zx-util";
import { patch, post } from "~/lib/game-master";
import {
	LINK_INTENT,
	createDrizzleForTurso,
	methodNotAllowed,
	noContent,
	sessions,
} from "@repo/db";
import { eq } from "drizzle-orm";
import { PinnedNote } from "./components/pinned-note";
import { NotePage } from "~/components/notes-page";
import { validateUser } from "~/lib/auth";

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	const sessionId = extractParam("sessionId", params);
	const userId = await validateUser(request);
	const form = await request.formData();

	if (request.method === "POST") {
		// creating a note in the session view
		form.append("userId", userId);
		form.append("linkId", sessionId);
		form.append("intent", LINK_INTENT.SESSIONS);
		const res = await post(context, "notes", form);
		return json(await res.json());
	}

	if (request.method === "PATCH") {
		const res = await patch(context, `sessions/${sessionId}`, form);
		return json(await res.json());
	}

	if (request.method === "PUT") {
		const noteId = form.get("noteId");
		form.append("linkIds", sessionId);
		const res = await post(context, `notes/${noteId}/links`, form);
		return json(await res.json());
	}

	if (request.method === "DELETE") {
		const db = createDrizzleForTurso(context.cloudflare.env);
		await db.update(sessions).set({ pinnedNoteId: "" }).where(eq(sessions.id, sessionId));
		return noContent();
	}
	return methodNotAllowed();
};

export default function SessionViewIndex() {
	const { session } = useSessionRouteData();
	const notes = session.notes.map((note) => note.note);
	return (
		<div className="space-y-16">
			<PinnedNote pinnedNoteId={session.pinnedNoteId} sessionId={session.id} />
			<NotePage notes={notes} entityId={session.id} entityType={"sessions"} action="" />
		</div>
	);
}
