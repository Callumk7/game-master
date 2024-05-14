import { EntityListBox } from "~/components/entity-listbox";
import { useCharacterRouteData } from "../_app.characters.$characterId/route";
import { EditorPreview } from "~/components/editor-preview";
import { Header } from "~/components/typeography";
import { Button } from "~/components/ui/button";
import { useSyncEditor } from "~/hooks/sync-editor";
import { PlusIcon } from "@radix-ui/react-icons";
import { useFetcher } from "@remix-run/react";
import ky from "ky";
import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { zx } from "zodix";
import { extractParam } from "~/lib/zx-util";
import { z } from "zod";
import { CharacterFactionCard } from "./components/faction-card";

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	const characterId = extractParam("characterId", params);
	console.log("This has actually happened");
	const { factionId } = await zx.parseForm(request, { factionId: z.string() });
	const form = await request.formData();
	const res = await ky.put(
		`${context.cloudflare.env.GAME_MASTER_URL}/factions/${factionId}/members/${characterId}`,
		{ body: form },
	);

	return null;
};

export default function CharacterIndex() {
	const { characterData } = useCharacterRouteData();
	const { editor, isEditing, setIsEditing } = useSyncEditor({
		initContent: characterData.bio,
		action: `/characters/${characterData.id}`,
	});
	return (
		<div className="grid grid-cols-2 gap-4">
			<div className="space-y-4">
				<div className="flex gap-x-4 items-center">
					<Header style="h2">Character Bio</Header>
					<Button variant="secondary" onPress={() => setIsEditing(!isEditing)}>
						{isEditing ? "Save" : "Edit"}
					</Button>
				</div>
				<EditorPreview
					editor={editor}
					isEditing={isEditing}
					htmlContent={characterData.bio}
				/>
			</div>
			<div className="space-y-10 pl-16">
				<div className="space-y-4">
					<div className="flex w-full justify-between">
						<Header style="h2">Factions</Header>
						<Button variant="ghost" size="icon">
							<PlusIcon />
						</Button>
					</div>
					<div className="border border-grade-6 p-4 rounded-lg">
						{characterData.factions.map((f) => (
							<CharacterFactionCard
								faction={f.faction}
								key={f.factionId}
								role={f.role}
								description={f.description}
							/>
						))}
					</div>
				</div>
				<div className="space-y-4">
					<div className="flex w-full justify-between">
						<Header style="h2">Sessions</Header>
						<Button variant="ghost" size="icon">
							<PlusIcon />
						</Button>
					</div>
					<EntityListBox
						type="sessions"
						items={characterData.sessions.map((s) => s.session)}
					/>
				</div>
			</div>
		</div>
	);
}
