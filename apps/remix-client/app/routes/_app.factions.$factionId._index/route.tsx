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
import { Container } from "~/components/layout";
import { Pencil1Icon } from "@radix-ui/react-icons";

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
		initContent: faction.description ?? "Faction description would be here..",
		action: `/factions/${faction.id}`,
		intent: INTENT.UPDATE_CONTENT,
	});
	return (
		<Container width="max">
			<div className="flex gap-2 items-center mb-4">
				<Header style="h2">Description</Header>
				<Button onPress={() => setIsEditing(!isEditing)} variant="ghost" size="sm">
					{isEditing ? "Save changes" : <Pencil1Icon />}
				</Button>
			</div>
			<EditorPreview
				editor={editor}
				isEditing={isEditing}
				htmlContent={optimisticContent}
			/>
		</Container>
	);
}
