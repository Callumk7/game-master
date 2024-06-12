import { useSyncEditor } from "~/hooks/sync-editor";
import { useCharacterRouteData } from "../_app.characters.$characterId/route";
import { TwoColumnView } from "~/components/layout";
import { LinksAside } from "~/components/links-aside";
import { Header } from "~/components/typeography";
import { Pencil1Icon, TriangleUpIcon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";
import { EditorPreview } from "~/components/editor-preview";
import { ImageUpload } from "~/components/image-upload";

export function CharacterBioView() {
	const { characterData } = useCharacterRouteData();
	const { editor, isEditing, setIsEditing, optimisticContent } = useSyncEditor({
		initContent: characterData.bio,
		action: `/characters/${characterData.id}`,
	});
	return (
		<TwoColumnView
			aside={
				<div>
					<LinksAside
						notes={characterData.notes.map((n) => n.note)}
						factions={characterData.factions.map((f) => f.faction)}
						sessions={characterData.sessions.map((s) => s.session)}
					/>
				</div>
			}
		>
			<ImageUpload imageSrc={characterData.image} alt="Character profile" />
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
		</TwoColumnView>
	);
}
