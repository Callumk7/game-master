import { Header } from "~/components/typeography";
import { useFactionRouteData } from "../_app.factions.$factionId/route";
import { RenderHtml } from "~/components/render-html";
import { useSyncEditor } from "~/hooks/sync-editor";
import { INTENT } from "@repo/db";
import { EditorPreview } from "~/components/editor-preview";
import { handleForwardUpdateFactionRequest } from "./queries.server";
import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { extractParam } from "~/lib/zx-util";
import { Button } from "~/components/ui/button";

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	console.log("this was fired");
	const factionId = extractParam("factionId", params);
	if (request.method === "PATCH") {
		return await handleForwardUpdateFactionRequest(context, factionId, request);
	}
};

export default function FactionIndex() {
	const { faction } = useFactionRouteData();
	const { editor, isEditing, setIsEditing, optimisticContent } = useSyncEditor({
		initContent: faction.description ?? "",
		action: `/factions/${faction.id}`,
		intent: INTENT.UPDATE_CONTENT,
	});
	return (
		<div>
			<Header>Faction</Header>
			<Button onPress={() => setIsEditing(!isEditing)}>Edit</Button>
			<EditorPreview
				editor={editor}
				isEditing={isEditing}
				htmlContent={optimisticContent}
			/>
		</div>
	);
}
