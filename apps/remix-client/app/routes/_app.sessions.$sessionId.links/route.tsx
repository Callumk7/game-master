import { useSessionRouteData } from "../_app.sessions.$sessionId/route";
import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { getFormAndAppendUserId } from "~/lib/forms";
import { badRequest } from "@repo/db";
import { post } from "~/lib/game-master";
import { extractParam } from "~/lib/zx-util";
import { getCompleteSessionNodesAndEdges } from "~/components/flow/utils";
import { NodeCanvas } from "~/components/flow/canvas";
import "reactflow/dist/style.css";

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	const sessionId = extractParam("sessionId", params);
	const form = await getFormAndAppendUserId(request);
	const linkId = form.get("linkId");
	const linkType = form.get("linkType");
	if (!linkId || !linkType) {
		return badRequest("No link data provided");
	}
	const res = await post(context, `sessions/${sessionId}/${linkType}/${linkId}`, form);
	return null;
};

export default function SessionLinksView() {
	const { session } = useSessionRouteData();
	const { initNodes, initEdges } = getCompleteSessionNodesAndEdges({
		...session,
		characters: session.characters.map((c) => c.character),
		factions: session.factions.map((f) => f.faction),
		notes: session.notes.map((n) => n.note),
	});
	return (
		<div className="w-full h-screen relative">
			<NodeCanvas initNodes={initNodes} initEdges={initEdges} />
		</div>
	);
}
