import { NotePage } from "~/components/notes-page";
import { useSessionRouteData } from "../_app.sessions.$sessionId/route";
import { ActionFunctionArgs, json } from "@remix-run/cloudflare";
import { LINK_INTENT, createDrizzleForTurso, methodNotAllowed } from "@repo/db";
import { extractParam } from "~/lib/zx-util";
import { post } from "~/lib/game-master";
import { validateUser } from "~/lib/auth";

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	const sessionId = extractParam("sessionId", params);
	const userId = await validateUser(request);
	if (request.method === "POST") {
		// creating a note in the session view
		const form = await request.formData();
		form.append("userId", userId);
		form.append("link", sessionId);
		form.append("intent", LINK_INTENT.SESSIONS);
		const res = await post(context, "notes", form);
		return json(await res.json());
	}
	return methodNotAllowed();
};

export default function SessionNotesView() {
	// session has loads of note data
	const { session } = useSessionRouteData();
	const notes = session.notes.map((note) => note.note);

	return <NotePage notes={notes} entityId={session.id} entityType={"sessions"} />;
}
