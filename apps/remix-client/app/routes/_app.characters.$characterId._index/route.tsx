import { useCharacterRouteData } from "../_app.characters.$characterId/route";
import { EditorPreview } from "~/components/editor-preview";
import { Header } from "~/components/typeography";
import { Button } from "~/components/ui/button";
import { useSyncEditor } from "~/hooks/sync-editor";
import { Pencil1Icon, TriangleUpIcon } from "@radix-ui/react-icons";
import { type ActionFunctionArgs, json } from "@remix-run/cloudflare";
import { extractParam } from "~/lib/zx-util";
import { post } from "~/lib/game-master";
import { LinksAside } from "~/components/links-aside";
import { TwoColumnView } from "~/components/layout";
import { Form } from "@remix-run/react";

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	// On the character page, we can add links to other entities, we do this
	// with a PUT request to the server, with the intent, and the required ids.
	// In the case of this specific route, that is ALWAYS a single id.
	if (request.method === "POST") {
		const characterId = extractParam("characterId", params);
		const form = await request.formData();
		const res = await post(context, `characters/${characterId}/links`, form);
		return res.clone()
	}
};

export default function CharacterIndex() {
	const { characterData } = useCharacterRouteData();
	const { editor, isEditing, setIsEditing, optimisticContent } = useSyncEditor({
		initContent: characterData.bio,
		action: `/characters/${characterData.id}`,
	});
	return (
		<TwoColumnView
			aside={
				<LinksAside
					notes={characterData.notes.map((n) => n.note)}
					factions={characterData.factions.map((f) => f.faction)}
					sessions={characterData.sessions.map((s) => s.session)}
				/>
			}
		>
			<div className="flex gap-x-6 items-center">
				<Header style="h2">Character Bio</Header>
				<Button variant="ghost" onPress={() => setIsEditing(!isEditing)} size="icon-sm">
					{isEditing ? <TriangleUpIcon /> : <Pencil1Icon />}
				</Button>
			</div>
			<EditorPreview
				editor={editor}
				isEditing={isEditing}
				htmlContent={optimisticContent}
			/>
      <div className="mt-16">
        <Form action="/upload" method="POST">
          <input type="file" name="image" />
          <button type="submit">Send file</button>
        </Form>
      </div>
		</TwoColumnView>
	);
}
